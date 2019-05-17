
function getTemplate(ftl, zip, filename) {
  var url = '/assets/templates/'+ftl
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          zip.file(filename, xhr.responseText);
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
    }
    xhr.ontimeout = function () {
      reject('timeout')
    }
    xhr.open('get', url, true)
    xhr.send();
  })
}

function zipPromise(zip, zipname) {
  return new Promise(function (resolve, reject) {
    var handleProgress = function(metadata) {
      console.log("progression: " + metadata.percent.toFixed(2) + " %");
      if(metadata.currentFile) {
          console.log("current file = " + metadata.currentFile);
      }
    }

    var promise;
    promise = zip.generateAsync({type : "blob"}, handleProgress);
    var handleSuccess = function(zipcontent) {
      console.log("project zipped");
      saveAs(zipcontent, zipname);
    }

    promise.then(handleSuccess).catch(reject);
    return resolve(promise);
  });
}



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

    var handleError = function(err) {
      console.log("error while zipping project");
      console.log(err);
    }

    getTemplate("gitignore.ftl", zip, ".gitignore")
      .then(result => getTemplate("dockerignore.ftl", zip, ".dockerignore"))
      .then(result => zipPromise(zip, artifactId+".zip"))
      .catch(handleError);

      
  } catch(error) {
    handleError(err);
  }
  return false;
}
