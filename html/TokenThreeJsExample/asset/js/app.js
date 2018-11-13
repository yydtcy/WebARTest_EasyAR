/**
 *
 * 请将第3个参数修改为你的WebAR Token
 * 如果不修改，请扫描身份证印有国徽的那一面来体验
 *
 */
//const recognizeUrl='https://9e65551b45f6ee6f1683202bb1aac923.cn1.crs.easyar.com:8080/search';
//const token='OzIWIZbePIY65A9RZ5tyWLxG2lGz6Ak8bJNMTCZUbNdA7k2b7zJoKt3ZIWxa1P8CO8OpcyJqWbnHKDIwVqC5JA==';
//const webAR = new WebAR(100, 'https://9e65551b45f6ee6f1683202bb1aac923.cn1.crs.easyar.com:8080/search', 'MJenSGhfCun8QxqnlUwG9KGj98S1QiNToGnqRzu3lw4lx6U9HC4qLy6c7sSZZ+sBHHSBpzwch03NdkD/LCr8mg==');
const webAR = new WebAR(100, 'https://cn1-crs.easyar.com:8443/search', 'I63ooxI48OcR9MseGyf9F3UpVoa4Seio4CtCM1k2kHD59TngdniDdS2FXAx3UWlStF+eUKVvoEJWuU2+bGgpcQ==');
const threeHelper = new ThreeHelper();
//const mainScene = new MainScene();
document.querySelector('#openCamera').addEventListener('click', function(){
    const videoSetting = {width: 480, height: 360};

    const video = document.querySelector('#video');
    const videoDevice = document.querySelector('#videoDevice');

    const openCamera = (video, deviceId, videoSetting) => {
        webAR.openCamera(video, deviceId, videoSetting)
            .then((msg) => {
                // 打开摄像头成功
                // 将视频铺满全屏(简单处理)
                let videoWidth = video.offsetWidth;
                let videoHeight = video.offsetHeight;

                if (window.innerWidth < window.innerHeight) {
                    // 竖屏
                    if (videoHeight < window.innerHeight) {
                        video.setAttribute('height', window.innerHeight.toString() +'px');
                    }
                }  else {
                    // 横屏
                    if (videoWidth < window.innerWidth) {
                        video.setAttribute('width', window.innerWidth.toString() +'px');
                    }
                }
            })
            .catch((err) => {
                alert(err);
                alert('打开视频设备失败');
            });
    };

    // 列出视频设备
    webAR.listCamera(videoDevice)
        .then(() => {
            openCamera(video, videoDevice.value, videoSetting);
            videoDevice.onchange = () => {
                openCamera(video, videoDevice.value, videoSetting);
            };

            document.querySelector('#openCamera').style.display = 'none';
            document.querySelector('#start').style.display = 'inline-block';
            document.querySelector('#stop').style.display = 'inline-block';
        })
        .catch((err) => {
            console.info(err);
            alert('没有可使用的视频设备');
        });
}, false);

document.querySelector('#start').addEventListener('click', () => {
    webAR.startRecognize((msg) => {
        alert('识别成功');

        // 识别成功后，从meta中取出model地址
        // const meta = JSON.parse(window.atob(msg.target.meta));
        // threeHelper.loadObject(meta.model);

        // 加载本地模型
        threeHelper.loadObject('asset/model/trex_v3.fbx');

        webAR.trace('加载模型');
        //initModel();
        //mainScene.draw();
    });
}, false);

document.querySelector('#stop').addEventListener('click', () => {
    webAR.stopRecognize();
}, false);
