const image_input = document.querySelector("#image_input");
var uploaded_image = "";
var fs = BrowserFS.BFSRequire('fs');

image_input.addEventListener("change", async () =>{
    var input = image_input.target;
    var reader = new FileReader();
    reader.onload = function(){
        uploaded_image = reader.result;
        var output = document.getElementById('output');
        output.src = uploaded_image;
    };
    reader.readAsDataURL(image_input.files[0]);
    await main();
})

async function main() {
    const gateway = 'https://ipfs.io/ipfs/';
    const ipfs = await IpfsCore.create();
    const result = await ipfs.add(uploaded_image);
    console.log(result);
    console.log(gateway+result.path);
}

console.log("Hello World");
