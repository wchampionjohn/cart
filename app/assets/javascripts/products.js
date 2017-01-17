var productApp = angularApplication.module('productApp', ['ngUpload', 'ui.bootstrap']);

productApp.controller('indexCtrl', function($scope, $http, $window, $timeout) {
  $scope.products = [];
  $scope.selectedProductIds = []

  $scope.loadProducts = function() {
    var page = $scope.page || 1
    var url = "/products.json?page=" + page;
    if($scope.keyword) {
      url += "&keyword=" + $scope.keyword;
    }

    $http.get(url).
      then(
        function(response) {
          $scope.products = response.data;
        }
    );

  };

  $scope.changeToEditMode = function() {
    $scope.onEditProducts = [];

    angular.forEach($scope.products,function(product){
      if($scope.selectedProductIds.indexOf(product.id) > -1) {
        $scope.onEditProducts.push(angular.copy(product));
      }
    });

    $scope.isEditMode = true;
  }

  $scope.saveBatchEdit = function() {
    var products = []
    var ids = $scope.onEditProducts.map(function(product){
      return product.id;
    })

    angular.forEach($scope.products,function(product){
      if(ids.indexOf(product.id) > -1){
        products.push(product)
      }
    })

    $http.post('/products/batch_update', {products: products} ).
      then(
        function() {
          alert('修改成功');
          $scope.loadProducts();
          $scope.isEditMode = false;
        },
        function(result) {
          mseeage = "The following error occurred\n" + result.data
          alert(mseeage);
        }
    );
  }

  var timer = false;
  $scope.$watch('keyword', function(){
    if(timer) {
      $timeout.cancel(timer);
    }
    timer = $timeout(function(){
      $scope.loadProducts();
    }, 500);
  });

  $scope.refresh = function() {
    $scope.keyword = '';
    $scope.loadProducts();
  }

  $scope.cancelEdit = function() {
    var products = [];
    var ids = $scope.onEditProducts.map(function(product){
      return product.id;
    })

    angular.forEach($scope.products,function(product){
      if(ids.indexOf(product.id) > -1){
        products.push(findById(this.onEditProducts, product.id))
      } else {
        products.push(product)
      }
    }, this)

    $scope.products = products;
    $scope.isEditMode = false;
  }

  $scope.batchDelete = function() {

    isSure = $window.confirm('Are you sure want to delete these data?');
    if(isSure){
      var data = $.param({
        ids: $scope.selectedProductIds
      });
      $http.delete('/products/batch_delete?' + data)
      .then(
        function(){
          alert('刪除成功');
          $scope.loadProducts();
        },
        function(response){
          // failure call back
        }
      );
    }
  }

});

productApp.controller('tableCtrl', function($scope, $http) {
  $scope.loadProducts();

  $scope.checkAll = function() {
    angular.forEach($scope.products,function(product){
      var idx = $scope.selectedProductIds.indexOf(product.id);
      var selected = $scope.selectAll;
      if(idx == -1 && selected) {
        $scope.selectedProductIds.push(product.id);
      }
      if(idx > -1 && !selected) {
        $scope.selectedProductIds.splice(idx, 1);
      }
    })
  }

});

productApp.controller('itemCtrl', function($scope, $http, $sce, $window) {
  $scope.isEdit = function(productId) {
    if(!$scope.isEditMode) {
      return false;
    }
    return $scope.selectedProductIds.indexOf(productId) > -1;
  }

  $scope.toggleProductsSelection = function(productId) {
    var idx = $scope.selectedProductIds.indexOf(productId);

    if (idx > -1) {
      $scope.selectedProductIds.splice(idx, 1);
    } else {
      $scope.selectedProductIds.push(productId);
    }
  }

  $scope.statusClass = function(status) {
    if(status == '正常供應') {
      result = 'bg-success';
    } else if(status == '補貨中') {
      result = 'bg-primary';
    } else {
      result = 'bg-danger';
    }
    return result;
  }

  $scope.hightlight = function(text){
    if(!$scope.keyword){
      return $sce.trustAsHtml(text);
    }

    return $sce.trustAsHtml(text.replace(new RegExp($scope.keyword, 'gi'), '<span class="text-danger">$&</span>'));
  }

  $scope.delete = function(id) {
    var isSure = $window.confirm('Are you sure want to delete this data?');

    if(isSure){
      $http.delete('/products/' + id + '.json').
        then(
          function(response) {
            $scope.loadProducts();
          }
        );
    }
  }

  $scope.locationEdit = function(id) {
    window.location = '/products/' + id + '/edit';
  }
});
