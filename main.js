// ==UserScript==
// @name         下载 bilibili 原图
// @namespace    LucunJi
// @version      1.0.0
// @description  以原来的格式右键下载 bilibili 动态和评论区中的图片，而不是 webp 或 avif
// @author       Lucun_Ji
// @license      WTFPL
// @match        https://*.bilibili.com/*
// @icon         https://t.bilibili.com/favicon.ico
// @homepage     https://github.com/LucunJi/download-bili-original-image
// @supportURL   https://github.com/LucunJi/download-bili-original-image/issues
// @grant        none
// @require https://code.jquery.com/jquery-3.7.1.slim.min.js#sha256=9261efb3407e3a9096e4654750d8eff6b3a663422f48845c7fbcc65034c340cf
// ==/UserScript==


(function() {
    $(`
<style>
#download-original-image-menu:hover {
    background-color: lightskyblue;
    color: white;
}

#download-original-image-menu {
    position: absolute;
    z-index: 999;
    user-select: none;
    font-size: small;
    padding: 5px 8px;
    border-radius: 3px;
    color: black;
    background-color: whitesmoke;
}
</style>`).appendTo('head')

    const menu = $('<div id="download-original-image-menu" style="display: none;">下载原图（Shift+右击打开浏览器菜单）</div>');
    menu.appendTo('body');

    function closeMenu() {
        menu.css('display', 'none');
        menu.off();
    }

    document.addEventListener('contextmenu', function(event) {
        const tgt = event.target;
        if (tgt.nodeName === 'IMG' && $(tgt).parents('.bili-album, .image-exhibition').length) {
            event.preventDefault();

            menu.css({
                'display': '',
                'top': event.pageY,
                'left': event.pageX
            });
            const imgSrc = new URL(tgt.src);
            imgSrc.protocol = 'https:'; // prevents mixed content if protocol is http:
            imgSrc.pathname = imgSrc.pathname.replace(/@.*\.(avif|webp)$/, '');
            const imgName = imgSrc.pathname.split('/').pop();
            menu.on('click', function(eventMenu) {
                console.log(eventMenu.data);
                fetch(imgSrc).then(resp => resp.blob()).then(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = imgName;
                    a.click();
                    delete a;
                });

                closeMenu();
            });
        }
    });

    document.addEventListener('click', function(event) {
        console.log(event);
        if (event.target.id !== 'download-original-image-menu') {
            closeMenu();
        }
    });
})();
