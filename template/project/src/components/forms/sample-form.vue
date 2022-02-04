<style scoped lang="scss">
@import "@/assets/styles/variables.scss";
</style>


<template>
  <c-form-section>
    <k-input-group :label="$l('designcode')">
      <k-parameter
        v-find="'fixingsystem.designcode'"
        :errors="errors['fixingsystem.designcode']"
      >
        <c-select
          :value="instance.fixingsystem.designcode"
          :options="options.fixingsystem.designcode"
          :formatter="(s) => $l(s, { capitalize: true })"
          @input="update('fixingsystem.designcode', $event)"
        />
      </k-parameter>
    </k-input-group>

    <c-form-section :title="$l('preset', { capitalize: true })">
      <k-input-group :label="$l('anchor_system')">
        <k-parameter>
          <c-select
            :value="instance.fixingsystem.system"
            :options="options.fixingsystem.system"
            @input="update('fixingsystem.system', $event)"
          />
        </k-parameter>
      </k-input-group>
      <k-input-group :label="$l('lba_type')">
        <k-parameter
          v-find="'fixingsystem.lba_type'"
          :errors="errors['fixingsystem.lba_type']"
        >
          <c-select
            :value="instance.fixingsystem.lba_type"
            :options="options.fixingsystem.lba_type"
            @input="update('fixingsystem.lba_type', $event)"
          />
        </k-parameter>
      </k-input-group>
      <k-input-group :label="$l('ha_type')">
        <k-parameter
          v-find="'fixingsystem.ha_type'"
          :errors="errors['fixingsystem.ha_type']"
        >
          <c-select
            :value="instance.fixingsystem.ha_type"
            :options="options.fixingsystem.ha_type"
            @input="update('fixingsystem.ha_type', $event)"
          />
        </k-parameter>
      </k-input-group>
      <k-input-group :label="$l('pin_type')">
        <k-parameter
          v-find="'fixingsystem.pin_type'"
          :errors="errors['fixingsystem.pin_type']"
        >
          <c-select
            :value="instance.fixingsystem.pin_type"
            :options="options.fixingsystem.pin_type"
            @input="update('fixingsystem.pin_type', $event)"
          />
        </k-parameter>
      </k-input-group>
      <k-input-group
        v-if="instance.fixingsystem.system !== 'TM'"
        :label="$l('anchor_material')"
      >
        <k-parameter>
          <c-select
            :value="instance.fixingsystem.material"
            :options="options.fixingsystem.material"
            @input="update('fixingsystem.material', $event)"
          />
        </k-parameter>
      </k-input-group>

      <c-form-section class="mb-4" :title="$l('use_preselected_anchor')">
        <template slot="title">
          <h5>{{ $l("use_preselected_anchor", { capitalize: true }) }}</h5>
        </template>
        <template slot="toolbar">
          <div class="c-box flex-limit">
            <c-checkbox
              :value="instance.fixingsystem.use_preselected_anchor"
              @input="update('fixingsystem.use_preselected_anchor', $event)"
            />
          </div>
        </template>
        <k-input-group
          :label="$l('favlist')"
          v-show="instance.fixingsystem.use_preselected_anchor"
          :style="{ 'margin-top': '0.5rem' }"
        >
          <k-parameter
            v-find="'fixingsystem.favlist'"
            :errors="errors['fixingsystem.favlist']"
          >
            <c-select
              :value="null"
              :options="options.fixingsystem.favlist"
              @input="update('fixingsystem.favlist', $event)"
            />
          </k-parameter>
          <template slot="outer">
            <c-button  fill="outline">
              <c-icon
                v-if="instance.fixingsystem.favlist < 1"
              ><svg data-v-4c67de66="" aria-hidden="true" data-icon="cog" viewBox="2 4 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-inline"><path d="M14.141 7.406l.995-.574a.751.751 0 00.35-.846 7.737 7.737 0 00-2.002-3.462.75.75 0 00-.906-.12l-.993.575a6.135 6.135 0 00-1.029-.595V1.236A.75.75 0 0010 .51a7.8 7.8 0 00-3.998 0 .75.75 0 00-.557.726v1.148a6.134 6.134 0 00-1.029.595l-.993-.574a.75.75 0 00-.906.119A7.737 7.737 0 00.515 5.986a.751.751 0 00.349.846l.995.574a6.178 6.178 0 000 1.188l-.995.574a.751.751 0 00-.35.846 7.737 7.737 0 002.002 3.462.75.75 0 00.906.12l.993-.575c.323.231.667.43 1.029.595v1.148A.75.75 0 006 15.49a7.8 7.8 0 003.998 0 .75.75 0 00.557-.726v-1.148a6.143 6.143 0 001.029-.595l.993.574a.75.75 0 00.906-.119 7.738 7.738 0 002.002-3.462.751.751 0 00-.35-.846l-.995-.574a6.183 6.183 0 000-1.188zm-1.646 1.97l1.37.79a6.256 6.256 0 01-1.059 1.829l-1.37-.791c-.999.856-1.145.94-2.38 1.376v1.581c-.699.12-1.413.12-2.113 0V12.58c-1.234-.436-1.38-.52-2.38-1.376l-1.37.79a6.256 6.256 0 01-1.057-1.828l1.37-.79c-.24-1.291-.24-1.46 0-2.752l-1.37-.79a6.256 6.256 0 011.058-1.829l1.37.791c.999-.856 1.145-.94 2.38-1.376V1.84c.699-.12 1.413-.12 2.113 0V3.42c1.234.436 1.38.52 2.38 1.376l1.37-.79a6.255 6.255 0 011.057 1.828l-1.37.79c.24 1.291.24 1.46 0 2.752zM8 5C6.346 5 5 6.346 5 8s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm0 4.5c-.827 0-1.5-.673-1.5-1.5S7.173 6.5 8 6.5s1.5.673 1.5 1.5S8.827 9.5 8 9.5z" fill="currentColor"></path></svg>
              </c-icon>
            </c-button>
          </template>
        </k-input-group>
      </c-form-section>
    </c-form-section>

    <c-form-section :title="$l('layout', { capitalize: true })">
      <k-input-group :label="$l('grid_spacing')">
        <k-parameter
          :def="instance.fixingsystem.grid_spacing"
          :val="instance.fixingsystem.grid_spacing"
        >
          <c-quantity-input
            :value="instance.fixingsystem.grid_spacing"
            @input="update('fixingsystem.grid_spacing', $event)"
            :minval="600"
            :maxval="1200"
            :step="150"
            unit="mm"
          />
        </k-parameter>
      </k-input-group>
    </c-form-section>
  </c-form-section>
</template>


<script>
import { call, get } from 'vuex-pathify';
import debounce from 'lodash/debounce';
import KInputGroup from '../ui/inputs/k-input-group.vue';
import SettingsIcon from '@/assets/icons/cog.svg';

export default {
  components: { SettingsIcon, KInputGroup },
  name: 'SampleForm',
  props: {
    instance: {
      type: Object,
      required: true,
    },
    // path: {
    //   type: String,
    //   required: true,
    // },
  },
  methods: {
    openForm: call('display/openForm'),
    async update(field, value) {
      await this.instance.$update(field, value);
    },
    getFindOptions(path) {
      const absolutePath = path ? `${this.path}.${path}` : this.path;
      return {
        id: absolutePath,
        before: () => this.openForm(this.instance.id),
      };
    },
  },
  computed: {
    getEntityErrors: get('errors/getEntityErrors'),
    errors() {
      return this.getEntityErrors(this.path);
    },
    debouncedUpdate() {
      return debounce(this.update, 500);
    },
    options() {
      const ops = this.instance.coercedSchema.options();
      ops.fixingsystem.lba_type = ops.fixingsystem.lba_type
        .filter((op) => op.startsWith(this.instance.fixingsystem.system));
      if (this.instance.fixingsystem.system === 'TM') {
        ops.fixingsystem.ha_type = ops.fixingsystem.ha_type
          .filter((op) => op.startsWith(this.instance.fixingsystem.system));
      }
      if (this.instance.fixingsystem.system === 'TM') {
        ops.fixingsystem.pin_type = ops.fixingsystem.pin_type
          .filter((op) => op.startsWith(this.instance.fixingsystem.system));
      }
      return ops;
    },
  },
};
</script>
