function generate() {
  var groupId = $('#form').find('input[name="groupId"]').val();
  var artifactId = $('#form').find('input[name="artifactId"]').val();
  var version = $('#form').find('input[name="version"]').val();
  var className = $('#form').find('input[name="className"]').val();

  if (! /\S/.test(groupId)) {
    groupId = "org.acme.quarkus.sample";
  }
  if (! /\S/.test(artifactId)) {
    artifactId = "my-quarkus-project";
  }
  if (! /\S/.test(version)) {
    version = "1.0-SNAPSHOT";
  }
  if (! /\S/.test(className)) {
    className = "org.acme.quarkus.sample.HelloResource";
  }

  var extensions = [];
  $.each($("#form .extensions option:selected"), function(){            
      extensions.push($(this).val());
  });

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
