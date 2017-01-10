var angularApplication = (function() {

  function set_rails_csrf(app) {
    app.config(function($httpProvider) {
      $httpProvider.defaults.headers.common['X-CSRF-Token'] =
        $('meta[name=csrf-token]').attr('content');
    });
  }

  return {
    module: function(name, modules) {
      var new_app = angular.module(name, modules);

      set_rails_csrf(new_app);

      return new_app;
    }
  };
})();
