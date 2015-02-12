CKEDITOR.dialog.add(
    "myupload",
      function (b) {
          return {
              title: "附件",
              minWidth: 590,
              minHeight: 300,
              contents: [{
                  id: "tab1",
                  label: "",
                  title: "",
                  expand: true,
                  padding: 0,
                  elements: [{
                      type: "html",
                      html: initImageDlgInnerHtml() //对话框中要显示的内容，这里的代码将发在下面
                  }]
              }],
              onOk: function () { //对话框点击确定的时候调用该函数
                  var D = this;
                  var element = b.document.createElement('div');
                  var imes = $('#uploadinfo').html();//获取上传的图片，用于取路径，将图片显示在富文本编辑框中

                  b.insertHtml(imes);

                  return;
              },
              onLoad: function () { //对话框初始化时调用
                  initEventImageUpload({'token':'123123unhasd12asd','key':'12313123123123123'}); //用于注册上传swfupload组件
              },
              onShow: function () {
                  clearCkImageUpload(); //在对话框显示时作一些特殊处理
              }
          };
      }
);

//编辑框初始化上传图片的回调----------自定义按钮插件
function initImageDlgInnerHtml() { //这是在对话框中要显示的内容
    var iHtml = "<div style='width:180px;margin:10px 0;' > <span id='btn-upload'></span></div><div id='progress'></div>"
    iHtml += " <div id='uploadinfo'>最多上传5个文件</div>";
    return iHtml;
}

//上面有个cke_dialog_start_button_z样式是根据自己的需要来写的

function initEventImageUpload(postParams) { //对上传控件的注册
    $(function () {
        var set = SwfUploadSettings;
        set.buttonPlaceElement = 'btn-upload';
        set.settingName = 'btn-upload';
        // set.customSettings = {"upload_target": 'progress', "uploadfiles": 1}
        set.postParams = postParams;//  添加防xss攻击的的验证码
        SwfUpload.uploadImage(5, 5, uploadSuccessCk, set);
    });
}
function clearCkImageUpload() { //对对话框弹出时作特殊处理
    $('#uploadinfo').html('<span class="waittext">等待上传...</span>');
}


//
var ckSwfu; //初始化上传控件
function ckeditorInitSwfu(progress, btn, spanButtonPlaceHolder) {
    var uploadUrl = "";
    //在firefox、chrome下，上传不能保留登录信息，所以必须加上jsessionid。
    var jsessionid = $.getCookie("JSESSIONID");
    if (jsessionid) {
        uploadUrl += "?jsessionid=" + jsessionid;
    }
    ckSwfu = new SWFUpload({
        upload_url: uploadUrl,
        flash_url: "",
        file_size_limit: "4 MB",
        file_types: "*.jpg;*.png;*.gif;*.jpeg;*.bmp",
        file_types_description: "Web Image Files",
        file_queue_limit: 0,
        custom_settings: {
            progressTarget: progress,
            cancelButtonId: btn
        },
        debug: false,

        button_image_url: "",
        button_placeholder_id: spanButtonPlaceHolder,
        button_text: "<span class='btnText'>上传图片</span>",
        button_width: 81,
        button_height: 24,
        button_text_top_padding: 2,
        button_text_left_padding: 20,
        button_text_style: '.btnText{color:#666666;}',
        button_cursor: SWFUpload.CURSOR.HAND,

        file_queued_handler: fileQueuedCk,
        file_queue_error_handler: fileQueueError,
        file_dialog_complete_handler: fileDialogCompleteCk,
        upload_start_handler: uploadStart,
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccessCk,
        upload_complete_handler: uploadComplete,
        queue_complete_handler: queueComplete
    });
};
//开始上传图片
function ckUploadImageStart(obj) {
    ckSwfu.startUpload();
}
//回调重写
function fileQueuedCk(file) {
    try {
        if ($("#ck_fs_upload_progress").html().indexOf(".jpg") == -1) {
            $("#ck_fs_upload_progress").html("");
        }
        var progress = new FileProgress(file, this.customSettings.progressTarget);
        progress.setStatus("Pending...");
        progress.toggleCancel(true, this);
        $(progress.fileProgressWrapper).css("display", "none");
        $("#ck_fs_upload_progress").append(" " + file.name);
    } catch (ex) {
        this.debug(ex);
    }
}
//回调重写，上传成功后
function uploadSuccessCk(file, serverData) {
    try {
        
        var obj = $.parseJSON(serverData);
        if (obj.IsError) {
            $("#" + file.id).html(obj.ErrMsg);
            $('#uploadinfo').html('上传失败！');
            setTimeout(function () { $("#" + file.id).hide(); }, 3000);
            return;
        } else {
            $("#" + file.id).hide();
        }
        //debugger;
        $('#uploadinfo .waittext').remove();
        var file = obj.Data;
        // TODO  使用file.File_Ext对文件类型进行判断，然后做不同文件不同类型的插入
        $('#uploadinfo').append("<div style='margin:5px;'><a href='" + file.File_Path + "' target='_blank'>" + file.File_Name + "." + file.File_Ext + "</a>")
        
    } catch (ex) {
        alert(ex);
    }
}

function completeHandler(msg) {  
        swfu.addPostParam( "category", '123123123123');
        swfu.addPostParam( "notes", '123123123123');
        swfu.startUpload();     
} 
//回调重写，主要是设置参数，如果需要的参数没有，就清空上传的文件，为了解决下次选择会上传没有参数时的图片
function fileDialogCompleteCk(numFilesSelected, numFilesQueued) {
    try {
        var commoNo = $("#commoNo").val();
        var brandNo = $("#brand option:selected").val();
        var catNo = $("#thirdCommon option:selected").val();
        //初始化上传图片
        if (brandNo != "" && commoNo != "" && catNo != "") {
            this.addPostParam("commoNo", commoNo);
            this.addPostParam("thirdCatNo", catNo);
            this.addPostParam("brandNo", brandNo);
            if (numFilesSelected > 0) {
                document.getElementById(this.customSettings.cancelButtonId).disabled = false;
            }
        } else {
            for (var i = 0; i < numFilesSelected; i++) {
                var promitId = this.customSettings.progressTarget;
                $("#" + promitId).find("*").remove();
                var fileId = this.getFile().id;
                this.cancelUpload(fileId, false);
            }
            $("#ck_fs_upload_progress").html("");
            alert("请选择分类和品牌！");
        }
    } catch (ex) {
        this.debug(ex);
    }
}

///jQuery扩展开始
//扩展Json功能
$.setCookie = function (name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = escape(name) + '=' + escape(value) + '; expires=' + date.toGMTString();
};

$.getCookie = function (name) {
    var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr != null) return unescape(arr[2]); return null;
};

$.delCookie = function (name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = $.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

var SwfUploadSettings = {
    settingName: "mysetting",
    flashUrl: "/cksw/ckeditor/plugins/myupload/swfs/swfupload.swf",
    uploadUrl: '/cksw/upload.php',
    buttonText: '<span class="button"  >点击上传 </span>',
    buttonTextStyle: '.button {text-align:center;vert-align: middle; color:#333333; padding-top:5px;font-size: 12pt; }',
    buttonImageUrl: "/cksw/ckeditor/plugins/myupload/swfs/XPButtonNoText_160x22.png",
    buttonWidth: 160,
    buttonHeight: 22,
    buttonTextTopPadding: 0,
    buttonTextLeftPadding: 0,
    buttonPlaceElement: "btn-upload",
    filePostName: "MyUploadFile",
    file_size_limit: "10280",
    file_upload_limit: 5,
    fileTypes: "*.*",
    fileTypesDescription: "",
    postParams: { "aid": "abcd", "type": "efgh" },
    customSettings: {
        "upload_target": "progress",
        "uploadfiles": 1
    },
    isDebug: false
};

var SwfUpload = {
    uploadImage: function (uploadLimit, queueLimit, callback, SwfUploadSettings) {
        this.CreateSWFUpload(uploadLimit, queueLimit, fileFCKDialogComplete, callback, SwfUploadSettings);
    },

    CreateSWFUpload: function (uploadLimit, queueLimit, completeHandler, successHandler, config) {
        var option = {
            settingName: config.settingName,
            upload_url: config.uploadUrl,
            file_post_name: config.filePostName,
            post_params: config.postParams,
            button_image_url: config.buttonImageUrl,
            button_placeholder_id: config.buttonPlaceElement,
            button_width: config.buttonWidth,
            button_height: config.buttonHeight,
            button_text: config.buttonText,
            button_text_style: config.buttonTextStyle,
            button_text_top_padding: config.buttonTextTopPadding,
            button_text_left_padding: config.buttonTextLeftPadding,
            file_size_limit: config.file_size_limit,//单个文件允许的大小
            file_types: config.fileTypes,
            file_types_description: config.fileTypesDescription,
            file_upload_limit: uploadLimit,//最大上传个数
            file_queue_limit: queueLimit,//上传队列最多可选个数
            file_queue_error_handler: fileQueueError,
            file_dialog_complete_handler: completeHandler,
            upload_progress_handler: uploadProgress,
            upload_error_handler: uploadError,
            upload_success_handler: successHandler,
            upload_complete_handler: uploadComplete,
            file_queued_handler: fileQueued,
            flash_url: config.flashUrl,
            button_window_mode: "OPAQUE",
            custom_config: config.customSettings,
            debug: config.isDebug
        };

        var swfu = new SWFUpload(option);
        swfu.addPostParam("commoNo", '12839jdaj182jasd');
    }
};

function ReDrawImage(ImgD, FitWidth, FitHeight) {
    var image = document.createElement('img'); // new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        var pi = image.width / FitWidth;
        if (image.height / pi > FitHeight) {
            pi = image.height / FitHeight;
            ImgD.height = FitHeight;
            ImgD.width = image.width / pi;
        }
        else {
            ImgD.height = image.height / pi;
            ImgD.width = FitWidth;
        }
    }
}

function fileQueued(file) {
    var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
    progress.setStatus("等待上传...");
    progress.toggleCancel(true, this, true);
    if (this.settings.post_params.uploadfiles == 0)
        this.setButtonDisabled(true);
}

function fileQueueError(file, errorCode, message) {
    try {
        var errorName = "";
        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                errorName = "文件内容为空";
                break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                errorName = "文件太大，上传文件不能超过10M";
                break;
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                errorName = "选择文件过多";
                alert(errorName);
                return;
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            default:
                errorName = "上传文件选择错误";
                break;
        }
        var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
        progress.setStatus(errorName);
        progress.setError();
        progress.toggleCancel(true, this, true);
    } catch (ex) {
        this.debug(ex);
    }
    this.setButtonDisabled(false);
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
    try {
        if (numFilesQueued > 0)
            this.startUpload();
    } catch (ex) {
        this.debug(ex);
    }
}
function fileFCKDialogComplete(numFilesSelected, numFilesQueued) {
    try {
        if (numFilesQueued > 0) {
            this.startUpload();
        }
    } catch (ex) {
        this.debug(ex);
    }
}

function startUpload() {
    debugger;
    swfu.startUpload();
}

function uploadProgress(file, bytesLoaded) {
    try {
        var percent = Math.ceil((bytesLoaded / file.size) * 100);

        var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
        progress.setProgress(percent);
        if (percent === 100) {
            progress.setStatus("正在创建缩略图...");
            progress.toggleCancel(false, this);
        } else {
            progress.setStatus("正在上传...");
            progress.toggleCancel(true, this);
        }
    } catch (ex) {
        this.debug(ex);
    }
}

function uploadSuccess(file, serverData) {
    try {
        var json = $.evalJSON(serverData);
        var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
        if (json.Result == 0) {
            progress.setComplete();
            progress.setStatus("文件上传成功");
            progress.toggleCancel(false);
        }
        else {
            progress.setError();
            progress.toggleCancel(true, this, true);
        };
    } catch (ex) {
        this.debug(ex);
    }
}

//上传头像成功执行
function uploadFaceSuccess(file, serverData) {
    try {
        var json = $.evalJSON(serverData);
        var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
        if (json.Result == 0) {
            progress.setComplete();
            progress.setStatus("文件上传成功");
            progress.toggleCancel(false);
        }
        else {
            progress.setError();
            //progress.setStatus(biurenerror[json.Result]);
            progress.toggleCancel(true, this, true);
        };
    } catch (ex) {
        this.debug(ex);
    }
}

function uploadFCKSuccess(file, serverData) {
    try {
        var json = $.evalJSON(serverData);
        var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
        if (json.Result == 0) {
            progress.setComplete();
            progress.setStatus("文件上传成功");
            progress.toggleCancel(false);
        }
        else {
            progress.setError();
            progress.toggleCancel(true, this, true);
        };
    } catch (ex) {
        this.debug(ex);
    }
}

function uploadComplete(file) {
    try {
        if (this.getStats().files_queued > 0)
            this.startUpload();
    } catch (ex) {
        this.debug(ex);
    }
    this.setButtonDisabled(false);
    //if (this.getStats().files_queued == 0)
    //    $("#" + this.settings.post_params.upload_target).hide();
}

function uploadError(file, errorCode, message) {
    //debugger;
    var progress = new FileProgress(file, this.settings.post_params.upload_target, this.settings.post_params.uploadfiles);
    try {
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                try {
                    progress.setCancelled();
                    progress.setStatus("已取消上传");
                    progress.remove();
                }
                catch (ex1) {
                    this.debug(ex1);
                }
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                try {
                    progress.setCancelled();
                    progress.setStatus("停止上传");
                    progress.toggleCancel(true, this);
                }
                catch (ex2) {
                    this.debug(ex2);
                }
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                progress.setCancelled();
                progress.setStatus("上传文件超过限制");
                progress.toggleCancel(true, this);
                break;
            default:
                progress.setCancelled();
                progress.setStatus("文件上传错误");
                progress.toggleCancel(true, this);
                break;
        }
    } catch (ex3) {
        this.debug(ex3);
    }
}

function FileProgress(file, targetID, isFiles) {
    var fileProgressID;
    if (isFiles == 0)
        fileProgressID = 'uploadProgress';
    else
        fileProgressID = file.id;

    this.fileProgressID = fileProgressID;

    if ($("#" + this.fileProgressID).length == 0) {
        var el = $("#" + targetID);
        var ff = "<div class='progressContainer green' id='" + this.fileProgressID + "'>";
        ff += "<div class='progressName'></div>";
        ff += "<img src='/cksw/ckeditor/plugins/myupload/swfs/cancel.png' class='progressCancle' title='取消上传' />";
        ff += "<div class='progressBarStatus'></div>";
        ff += "<div class='progressBarInProgress'></div>";
        ff += "</div>";

        el.append(ff);
    }
    else {
        $("#" + this.fileProgressID).attr("class", "progressContainer green");
    }

    $("#" + targetID).show();
    $("#" + this.fileProgressID).children("div:eq(0)").html(file.name);
}

FileProgress.prototype.setProgress = function (percentage) {
    $("#" + this.fileProgressID).attr("class", "progressContainer green");
    $("#" + this.fileProgressID).children("div:eq(2)").attr("class", "progressBarInProgress").attr("style", "width:" + percentage + "%");
};
FileProgress.prototype.setComplete = function () {
    $("#" + this.fileProgressID).attr("class", "progressContainer blue");
    $("#" + this.fileProgressID).children("div:eq(2)").attr("class", "progressBarComplete").attr("style", { "width": "" });
};
FileProgress.prototype.setError = function () {
    $("#" + this.fileProgressID).attr("class", "progressContainer red");
    $("#" + this.fileProgressID).children("div:eq(2)").attr("class", "progressBarError").attr("style", { "width": "" });
};
FileProgress.prototype.setCancelled = function () {
    $("#" + this.fileProgressID).attr("class", "progressContainer");
    $("#" + this.fileProgressID).children("div:eq(2)").attr("class", "progressBarError").attr("style", { "width": "" });
};
FileProgress.prototype.setStatus = function (status) {
    $("#" + this.fileProgressID).children("div:eq(1)").html(status);
};
FileProgress.prototype.toggleCancel = function (show, swfuploadInstance, isMove) {
    // ("#" + this.fileProgressID).children("img:eq(0)").get(0).style.visibility = show ? "visible" : "hidden";
    if (swfuploadInstance) {
        var fileProgressID = this.fileProgressID;
        var fileId = this.fileId;
        if (isMove == true)
            $("#" + this.fileProgressID).children("img:eq(0)").click(function () { $("#" + fileProgressID).fadeOut("slow"); });
        else
            $("#" + this.fileProgressID).children("img:eq(0)").click(function () {
                swfuploadInstance.cancelUpload(fileId);
                return false;
            });
    };
};
FileProgress.prototype.remove = function () {
};