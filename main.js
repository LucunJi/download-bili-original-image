// ==UserScript==
// @name         Download bili original image
// @namespace    LucunJi
// @version      1.0.0
// @description  Download image as its original format from bilibili
// @author       Lucun_Ji
// @license      WTFPL
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @homepage     https://github.com/LucunJi/download-bili-original-image
// @supportURL   https://github.com/LucunJi/download-bili-original-image/issues
// @grant        none
// ==/UserScript==

(function() {
    let styleSheet = document.createElement('style');
    styleSheet.innerText = `
        .down_orig_button {
            transform: translate(10%, -110%);
            opacity: 0;
            transition: opacity 0.5s;
        }
        .down_orig_button:hover {
            opacity: 1;
        }
        `;
    document.head.appendChild(styleSheet);

    function downloadImg(imgSrc, filename) {
        fetch(imgSrc).then(resp => resp.blob()).then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            delete a;
        });
    }

    window.setInterval(() => {
        let previews = document.getElementsByClassName('bili-album__preview__picture');
        for (const node of previews) {
            if (!node.classList.contains('has_download_original_button')) {
                let downBtn = document.createElement('button');
                downBtn.innerHTML = '<u>⤓</u>';
                downBtn.classList.add('down_orig_button');
                node.appendChild(downBtn);

                downBtn.addEventListener('click', function (event) {
                    event.stopPropagation();

                    const imgUrl = node.getElementsByTagName('img')[0]?.src;
                    if (imgUrl === undefined) return;
                    const imgUrlOrig = imgUrl.replace(/@.*\.(avif|webp)$/, '');
                    const urlParts = imgUrlOrig.split('/');
                    const imgName = urlParts[urlParts.length - 1];
                    downloadImg(imgUrlOrig, imgName);
                }, { capture: true });

                node.classList.add('has_download_original_button');
            }
        }
    }, 500);
})();
