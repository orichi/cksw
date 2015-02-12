var SwfUploadSettings = {
    settingName: "mysetting",
    flashUrl: "/JS/swfupload/swfupload.swf",
    uploadUrl: '/cksw/upload.php',
    buttonText: '<span class="button"  >点击上传 </span>',
    buttonTextStyle: '.button {text-align:center;vert-align: middle; color:#333333; padding-top:5px;font-size: 12pt; }',
    buttonImageUrl: "/images/button.png",
    buttonWidth: 80,
    buttonHeight: 22,
    buttonTextTopPadding: 0,
    buttonTextLeftPadding: 0,
    buttonPlaceElement: "spanButtonPlaceholder",
    filePostName: "MyUploadFile",
    file_size_limit: "10280",
    file_upload_limit: 5,
    fileTypes: "*.*",
    fileTypesDescription: "",
    postParams: { "aid": "", "type": "" },
    customSettings: {
        "upload_target": "divFileProgressContainer",
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
        //console.log(this.settings);
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
    debugger;
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
        ff += "<img src='/JS/swfupload/cancel.png' class='progressCancle' title='取消上传' />";
        ff += "<div class='progressBarStatus'></div>";
        ff += "<div class='progressBarInProgress'></div>";
        ff += "</div>";
        console.log(ff);
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