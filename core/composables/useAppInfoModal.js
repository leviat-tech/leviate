import Vue from 'vue';

const appInfoModal = new Vue({
  data() {
    return {
      isOpen: false,
      appName: '',
      appVersion: '',
      buildDate: '',
    }
  },
  created() {
    fetch('manifest.json')
      .then(res => res.json())
      .then(manifestJson => {
        this.appName = manifestJson.name;
        this.appVersion = manifestJson.version;
        this.buildDate = new Date(manifestJson.date).toLocaleDateString().replace(/\//g, '-');
      });
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    }
  }
});

export default () => appInfoModal;
