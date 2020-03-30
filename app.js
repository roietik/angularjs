app = angular.module("app", []);

app.filter("unique", function() {
  return function(collection, keyname) {
    var output = [],
      keys = [];
    angular.forEach(collection, function(item) {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});

app.controller("main", function($scope) {
  $scope.add = {};
  $scope.edit = {};
  $scope.del = [];
  $scope.title = "Add";
  $scope.isDel = false;
  $scope.alert = {
    title: "",
    class: "hidden",
    isAlert: false
  };
  $scope.select = "All";
  $scope.predefRooms = ["I", "II", "III", "IV", "V", "VI"];
  $scope.predefGrades = [1, 2, 3, 4, 5, 6];
  $scope.isEdited = [false, null];
  $scope.get = localStorage.getItem("data");
  $scope.data =
    localStorage.getItem("data") !== null
      ? JSON.parse($scope.get)
      : [
          { name: "Radosław Grzymała", room: "III", grade: "5" },
          { name: "Patrycja Smardzewska", room: "II", grade: "6" },
          { name: "Marcin Gibalski", room: "I", grade: "4" }
        ];
  $scope.filter = $scope.data;

  localStorage.setItem("data", JSON.stringify($scope.data));

  $scope.avg = function() {
    let all = [];
    $scope.filter.map(function(item) {
      all.push(item.grade);
    });

    const avg = all.reduce(function(avg, value, _, { length }) {
      return avg + value / length;
    }, 0);

    return avg;
  };

  $scope.addData = function() {
    if ($scope.isEdited[0]) {
      const index = $scope.isEdited[1];

      if (index !== -1) {
        $scope.data[index] = {
          name: $scope.add.name,
          room: $scope.add.room.trim(),
          grade: $scope.add.grade.trim()
        };
        $scope.handleAlert("edited");
      }
      localStorage.setItem("data", JSON.stringify($scope.data));
    } else {
      $scope.data.push({
        name: $scope.add.name,
        room: $scope.add.room.trim(),
        grade: $scope.add.grade.trim()
      });
      localStorage.setItem("data", JSON.stringify($scope.data));
      $scope.handleAlert("added");
    }
    $scope.isEdited = [false, null];
    $scope.add = {};
  };

  $scope.editData = function(val, title) {
    $scope.changeTitle(title);
    const index = $scope.data.indexOf(val);
    $scope.add = $scope.data[index];
    console.log("data by index", $scope.data[index]);
    $scope.isEdited = [true, index];
    console.log($scope.isEdited);
  };

  $scope.deleteData = function(idx, val) {
    if ($scope.isDel) {
      const stateId = $scope.data.indexOf($scope.del[1]);
      $scope.data.splice(stateId, 1);
      $scope.filter.splice($scope.del[0], 1);
      localStorage.setItem("data", JSON.stringify($scope.data));
    } else {
      const index = $scope.data.indexOf(val);
      $scope.data.splice(index, 1);
      $scope.filter.splice(idx, 1);
      localStorage.setItem("data", JSON.stringify($scope.data));
    }
    $scope.handleAlert("deleted");
    $scope.add = {};
    $scope.del = false;
  };

  $scope.prevDeleteData = function(idx, val) {
    const index = $scope.data.indexOf(val);

    $scope.add = {};
    $scope.del = [index, val];
    $scope.isDel = true;
  };
  $scope.changeTitle = function(title) {
    $scope.title = title;
  };

  $scope.handleAlert = function(alert) {
    if (alert === "edited") {
      $scope.alert = {
        title: alert,
        class: "alert alert-info show",
        isAlert: true
      };
    }
    if (alert === "added") {
      $scope.alert = {
        title: alert,
        class: "alert alert-success show",
        isAlert: true
      };
    }
    if (alert === "deleted") {
      $scope.alert = {
        title: alert,
        class: "alert alert-danger show",
        isAlert: true
      };
    }
  };
  $scope.resetAlert = function() {
    $scope.alert = {
      title: "",
      class: "hidden",
      isAlert: false
    };
  };

  $scope.filterData = function() {
    $scope.add = {};
    $scope.predefRooms.map(function(val) {
      if ($scope.select.trim() === val.trim()) {
        const res = $scope.data.filter(function(item) {
          return item.room === val;
        });
        $scope.filter = res;
      } else if ($scope.select.trim() === "All") {
        $scope.filter = $scope.data;
      }
    });
  };
});

$("#submit").click(function(e) {
  $("#addModal").modal("hide");
});
