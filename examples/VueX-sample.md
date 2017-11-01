# VueX store integration

This is a code example (by @codewp) for how to use `vue2-dragula` with VueX store (see [issue #15](https://github.com/kristianmandrup/vue2-dragula/issues/15#issuecomment-336246898))

```html
<template>
  <div id="wccs-pricing-list" class="wrap">
    <loading :show="showLoading"></loading>
    <h1 class="wp-heading-inline">{{ strings.pricing }}</h1>
    <router-link to="/pricing/0" class="page-title-action">{{ strings.add_new }}</router-link>
    <table v-show="pricingList.length" id="pricing-list" class="widefat wccs-list-table">
      <thead>
        <tr>
          <th></th>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody class="container" v-dragula="pricingList" drake="pricingList">
        <tr v-for="pricing in pricingList" v-bind:key="pricing">
          <td></td>
          <td>{{ pricing.id }}</td>
          <td>{{ pricing.name }}</td>
          <td>
            <select v-model="pricing.status" @change="updateStatus( pricing )">
              <option value="0">{{ strings.disabled }}</option>
              <option value="1">{{ strings.enabled }}</option>
            </select>
          </td>
          <td>
            <router-link :to="'/pricing/' + pricing.id" class="button button-primary" :title="strings.edit"><i class="fa fa-edit" aria-hidden="true"></i></router-link>
            <button class="button button-delete" @click="deletePricing( pricing.id )" :title="strings.delete"><i class="fa fa-remove" aria-hidden="true"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

```html
<script>
import Vue from 'vue'
import _ from 'lodash'
import { Vue2Dragula } from 'vue2-dragula'
import Loading from '../components/Loading.vue'

Vue.use( Vue2Dragula );

export default {
  name : 'pricing-list',

  created() {
    const $service = this.$dragula.$service
    $service.options( 'pricingList', { direction: 'vertical' } )
    $service.eventBus.$on( 'dragend', (args) => {
      this.pricingList.forEach( ( value, index ) => {
        value.ordering = index + 1;
      });
      this.updateOrders();
    } )
  },

  data() {
    return {
      pricingList : _.cloneDeep( this.$store.state.pricingList ),
      showLoading : false
    }
  },

  components : {
    'loading' : Loading
  },

  methods : {
    deletePricing : function( id ) {
      this.showLoading = true;
      this.wccsResource.delete(
        {
          action : 'wccs_delete_condition',
          nonce : this.wccsNonce,
          id : id
        }
      ).then( response => {
        if ( 1 == response.body.success ) {
          this.$store.commit( 'DELETE_PRICING', id );
          this.pricingList = _.cloneDeep( this.$store.state.pricingList );
        }
      }).finally( () => {
        this.showLoading = false;
      });
    },
    updateOrders : function() {
      var conditions = [];
      this.pricingList.forEach( ( value, index ) => {
        conditions.push( { id : value.id, ordering : value.ordering } );
      });

      if ( conditions.length ) {
        this.showLoading = true;
        this.wccsResource.save(
        {
          action : 'wccs_update_conditions_ordering',
          nonce : this.wccsNonce,
          conditions : conditions,
          type : 'pricing'
        }
        ).then( response => {
          if ( 1 == response.body.success && response.body.conditions ) {
            this.$store.commit( 'SET_PRICING_LIST', response.body.conditions );
          }
        }).finally( () => {
          this.showLoading = false;
        });
      }
    },
    updateStatus : function( pricing ) {
      this.showLoading = true;
      this.wccsResource.save(
        {
          action : 'wccs_update_condition_status',
          nonce : this.wccsNonce,
          id : pricing.id,
          status : pricing.status
        }
      ).then( response => {
        if ( 1 == response.body.success ) {
          this.$store.commit( 'UPDATE_PRICING_STATUS', { id : pricing.id, status : pricing.status } );
          this.pricingList = _.cloneDeep( this.$store.state.pricingList );
        } else {
          // @todo showing error message.
          this.pricingList = _.cloneDeep( this.$store.state.pricingList );
        }
      }).finally( () => {
        this.showLoading = false;
      });
    }
  }
}
</script>
```

The key here is the `$service.eventBus.$on( 'dragend', dragHandler)` setup done on component creation in `created()`.

```js
created() {
  const $service = this.$dragula.$service
  $service.options( 'pricingList', { direction: 'vertical' } )
  $service.eventBus.$on( 'dragend', (args) => {
    this.pricingList.forEach( ( value, index ) => {
      value.ordering = index + 1;
    });
    this.updateOrders();
  } )
},
```

Which triggers `updateOrders`

```js
updateOrders : function() {
  // use web service to save updated resource
  this.wccsResource.save(resource).then((response) => {
    // ...
    this.$store.commit( 'SET_PRICING_LIST', response.body.conditions );
  })
}
```

Then there is the `delete` button, triggering a `delete` action:

`<button class="button button-delete" @click="deletePricing( pricing.id )" ... </button>`

```js
  deletePricing : function( id ) {
    // use web service to delete resource
  this.wccsResource.delete(resource).then((response) => {
    // ...
    this.$store.commit( 'DELETE_PRICING', id );
  })
```
