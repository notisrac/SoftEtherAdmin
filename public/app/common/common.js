'use strict';

var module = angular.module('commonModule', [
  'ngRoute'
]);

/*
 *          GENERIC COMPONENTS
 */

module.component('loadingIndicator', {
  templateUrl: 'app/common/loadingIndicator.template.html',
  bindings: {
      errorMessage: '<',
      isLoading: '<'
  },
  controller: function () {
      var ctrl = this;

      // ctrl.$onInit = function () {
      //     console.log('init');
      // };

      // ctrl.$onChanges = function (changes) { 
      //     console.log('CHANGE! ' + ctrl.isLoading + ' - ' + ctrl.errorMessage);
      // };

  }/*,
  controllerAs: 'ctrl'*/
});

module.component('infoCard', {
  templateUrl: 'app/common/infoCard.template.html',
  bindings: {
      size: '@',
      icon: '@',
      title: '@',
      category: '@',
      value: '<',
      errorMessage: '<',
      loading: '<'
  },
  controller: function () {
      var ctrl = this;
      // console.log('infoCard');
  }
});

module.component('keyValueTable', {
  templateUrl: 'app/common/keyValueTable.template.html',
  bindings: {
      data: '<',
      headerKey: '@',
      headerValue: '@',
      title: '@',
      category: '@',
      icon: '@',
      size: '@',
      errorMessage: '<',
      loading: '<'
  },
  controller: function () {
      var ctrl = this;
      // console.log('keyValueTable');
  }
});

module.component('autoDataTable', {
  templateUrl: 'app/common/autoDataTable.template.html',
  bindings: {
      data: '<',
      header: '<',
      title: '@',
      category: '@',
      icon: '@',
      size: '@',
      errorMessage: '<',
      loading: '<',
      reloadCallback: '<'
  },
  controller: function () {
      var ctrl = this;
      //ctrl.allowReload = false;
      // console.log('autoDataTable');
  }
});
