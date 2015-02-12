CKEDITOR.plugins.add(
    "myupload",
      {
          requires: ["dialog"], //当按钮触发时弹出对话框
          init: function (a) {
              a.addCommand("myupload", new CKEDITOR.dialogCommand("myupload"));
              a.ui.addButton(
                "FileAttachs",
                {
                    label: "附件",
                    command: "myupload",
                    icon: this.path + "swfupload.png"
                });
              CKEDITOR.dialog.add("myupload", this.path + "dialogs/myupload.js");
          }
      }
);