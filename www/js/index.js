const app = document.querySelector('.app');
const message = document.querySelector('.message');
const btn = document.querySelector('.btn');

const btnTexts = {
    ready: 'Load Image',
    loaded: 'Save Image',
};
    
const messageTexts = {
    ready: 'Device is Ready',
    loading: 'Loading Image',
    loaded: 'Image Loaded',
    saving: 'Saving Image',
    saved: 'Image Saved',
};

const setUI = state => {
    const btnText = btnTexts[state];
    const messageText = messageTexts[state];
    
    if (btnText) {
        btn.hidden = false;
        btn.textContent = btnText;
    } else {
        btn.hidden = true;
    }
    
    if (messageText) {
        message.hidden = false;
        message.textContent = messageText;
    } else {
        message.hidden = true;
    }
};

const load = (url, callback) => {
    const loader = new XMLHttpRequest();
    loader.onload = () => callback(loader.response);
    loader.open('GET', url, true);
    loader.responseType = 'blob';
    loader.send();
};

const save = (blob, filename, callback) => {
    const onErrorHandler = e => console.error('file save error ', filename, e);

    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, dirEntry => {
        dirEntry.getFile(filename, { create: true, exclusive: false }, fileEntry => {
            fileEntry.createWriter(fileWriter => {
                fileWriter.onwriteend = callback;
                fileWriter.onerror = onErrorHandler;
                fileWriter.write(blob);
            }, onErrorHandler);
        }, onErrorHandler);
    }, onErrorHandler);
};

const rafHandler = () => {
    const rotation =  Number(app.style.getPropertyValue('--rotation'));
    app.style.setProperty('--rotation', rotation + 1);

    requestAnimationFrame(rafHandler);
};

const onLoadBtnClick = () => {
    btn.removeEventListener('click', onLoadBtnClick);
    setUI('loading');

    load('https://rigwarl.github.io/cordova-file-freeze/test-image-9mb.png', (response) => {
        setUI('loaded');

        const onSaveBtnClick = () => {
            btn.removeEventListener('click', onSaveBtnClick);
            setUI('saving');
            save(response, 'test-image-9mb.png', () => {
                setUI('saved');
                setTimeout(() => {
                    setUI('ready');
                    btn.addEventListener('click', onLoadBtnClick);
                }, 3000);
            });
        };

        btn.addEventListener('click', onSaveBtnClick);
    });
};

const init = () => {
    setUI('ready');
    btn.addEventListener('click', onLoadBtnClick);
};

document.addEventListener('deviceready', init);
requestAnimationFrame(rafHandler);
