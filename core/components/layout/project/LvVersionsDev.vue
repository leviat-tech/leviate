<template>
  <div class="mt-6 bg-danger text-white p-0.5 text-center text-xs font-bold">Development tools</div>

  <div class="flex space-x-1 mt-1">
    <CButton v-bind="buttonProps" title="Save this design to a file" @click="onDownLoadFile">
      <CIcon type="download" size="sm" />
      <div>Save</div>
    </CButton>

    <label>
      <input @change="onRestoreFromFile" type="file" ref="uploadfile" hidden />
      <CButton v-bind="buttonProps" @click="$refs.uploadfile.click()" title="Upload design from a file">
        <CIcon type="upload" size="sm" />
        <div>Restore</div>
      </CButton>
    </label>

    <CButton v-bind="buttonProps" @click="clearStorage" title="Reset local storage">
      <CIcon type="sync" size="sm" />
      <div>Reset</div>
    </CButton>
  </div>
</template>

<script setup>
import { useMock } from '@crhio/leviate/host-mock';
import { useHost } from '@crhio/leviate';

const buttonProps = {
  class: 'flex flex-1 items-center space-x-1 !px-3 font-bold',
  color: 'sky',
  size: 'xs'
}

const {
  clearStorage,
  localStorageBackup,
} = useMock();

async function onDownLoadFile() {
  const appname = useHost().getMeta().configurator.name;
  const configname = localSettings.activeVersionId;
  var backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    backup[key] = escape(encodeURIComponent(value));
  }
  var json = JSON.stringify(backup);
  var base = window.btoa(json);
  var href = 'data:text/javascript;charset=utf-8;base64,' + base;
  var link = document.createElement('a');
  link.setAttribute('download', `${appname}_${configname}.json`);
  link.setAttribute('href', href);
  document.querySelector('body').appendChild(link);
  link.click();
  link.remove();
}

function onRestoreFromFile(e) {
  const f = e.target.files[0]
  if (f) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var text = e.target.result;
      var backup = JSON.parse(text);
      for (var key in backup) {
        var value = decodeURIComponent(unescape(backup[key]));
        window.localStorage.setItem(key, value);
      }
    };
    reader.readAsText(f);
  } else {
    alert('Failed to load file');
  }

  window.location.reload();
}
</script>
