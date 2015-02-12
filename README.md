# ckeditor和swfupload整合版本
## ckeditor为4.4 	swfupload版本2.2
通过ckeditor自定义插件，对swfupload进行整合，整合注意事项，文件为(ckeditor/plugins/myupload/dialogs/myupload.js line 205附近，line 488)
>1. 	使用正确相应的js，swf，图片路径
>2. 	修改相应的uploadUrl
>3. 	如果有随文件一块post到服务器的数据，请使用 initEventImageUpload({'token':'123123unhasd12asd'})函数提交
>4. 	post返回数据为json格式，看样例upload.php，没有做图片处理

附上post的数据，供图片处理做参考
>------------ei4cH2Ij5gL6ei4cH2gL6gL6GI3cH2
>Content-Disposition: form-data; name="Filename"

>QQ图片20141231160433.jpg
>------------ei4cH2Ij5gL6ei4cH2gL6gL6GI3cH2
>Content-Disposition: form-data; name="token"

>123123unhasd12asd
>------------ei4cH2Ij5gL6ei4cH2gL6gL6GI3cH2
>Content-Disposition: form-data; name="key"

>12313123123123123
>------------ei4cH2Ij5gL6ei4cH2gL6gL6GI3cH2
>Content-Disposition: form-data; name="MyUploadFile"; filename="QQ图片20141231160433.jpg"
>Content-Type: application/octet-stream


>------------ei4cH2Ij5gL6ei4cH2gL6gL6GI3cH2
>Content-Disposition: form-data; name="Upload"

>Submit Query
>------------ei4cH2Ij5gL6ei4cH2gL6gL6GI3cH2--