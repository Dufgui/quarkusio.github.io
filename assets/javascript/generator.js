function generate() {
  try {
    let zip = new JSZip();

    if(!JSZip.support.blob) {
      console.log("This demo works only with a recent browser !");
      return false;
    }

    zip.file("idlist.txt", 'PMID:29651880\nPMID:29303721');
    
    var handleProgress = function(metadata) {
      console.log("progression: " + metadata.percent.toFixed(2) + " %");
      if(metadata.currentFile) {
          console.log("current file = " + metadata.currentFile);
      }
    }

    var handleSuccess = function(content) {
      console.log("project zipped");
      saveAs(new Blob(content, {type: "application/zip"}), "download.zip");
    }

    var handleError = function(err) {
      console.log("error while zipping project");
      console.log(err);
    }

    var promise;
    if (JSZip.support.uint8array) {
      promise = zip.generateAsync({type : "uint8array"}, handleProgress);
    } else {
      promise = zip.generateAsync({type : "string"}, handleProgress);
    }

    promise.then(handleSuccess).catch(handleError);
  } catch(error) {
    handleError(err);
  }
  return false;
}
