<template>
  <div class="mt-6 bg-status-danger text-white p-1 text-center text-xs font-bold">
    Development tools
  </div>

  <div class="flex justify-between mt-1">
    <CButton
      size="xs"
      title="Save this design to a file"
      @click="onDownLoadFile"
    >
      <CIcon type="download" size="xs" />
      <div>Save</div>
    </CButton>

    <label class="">
      <input @change="onRestoreFromFile" type="file" ref="uploadfile" hidden />
      <CButton
        size="xs"
        @click="$refs.uploadfile.click()"
        title="Upload design from a file"
      >
        <CIcon type="upload" size="xs" />
        <div>Restore</div>
      </CButton>
    </label>

    <CButton
      size="xs"
      @click="clearStorage"
      title="Reset local storage"
    >
      <CIcon type="sync" size="xs" />
      <div>Reset</div>
    </CButton>
    
  </div>
</template>

<script setup>
import { useMock } from '@crhio/leviate/host-mock';
import { useHost } from '@crhio/leviate';
import useVersions from '@crhio/leviate/composables/useVersions';

const { clearStorage } = useMock();

async function onDownLoadFile() {
  const appname = useHost().meta.configurator.name;
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
  link.setAttribute(
    'download',
    `${appname}_${useVersions().activeVersion.value.name}.json`
  );
  link.setAttribute('href', href);
  document.querySelector('body').appendChild(link);
  link.click();
  link.remove();
}

function onRestoreFromFile(e) {
  const f = e.target.files[0];
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
