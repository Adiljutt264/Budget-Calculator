var budgetcontroller = (function () {
    var datastr = {
        allitems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentages: -1
    };
    var calculateTotal = function (typey) {
        var sum = 0;
        datastr.allitems[typey].forEach(function (cur) {
            sum += cur.textast;
        });
        datastr.totals[typey] = sum;
    };
    var expense = function (type, textas, textast) {
        this.type = type;
        this.textas = textas;
        this.textast = textast;
        this.percentage = -1;
    };
    expense.prototype.percentagecalculator = function (totalincome) {
        if (totalincome > 0) {
            this.percentage = Math.round((this.textast / totalincome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    expense.prototype.getp = function () {
        return this.percentage;
    };
    var income = function (type, textas, textast) {
        this.type = type;
        this.textas = textas;
        this.textast = textast;
    };
    return {
        additem: function (type, value, amount) {
            var newitem,
                id;
            // create newid
            if (datastr.allitems[type].length > 0) {
                id = datastr.allitems[type][datastr.allitems[type].length - 1].type + 1;
            } else {
                id = 0;
            }
            // creates new item based on exp or inc
            if (type == "exp") {
                newitem = new expense(id, value, amount);
            } else if (type == "inc") {
                newitem = new income(id, value, amount);
            }
            // push that item into the datastructure
            datastr.allitems[type].push(newitem);
            // return the new element
            return newitem;
        },
        deleteiten: function (type, id) {
            var ids,
                index;
            ids = datastr.allitems[type].map(function (cur) {
                return cur.type;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                datastr.allitems[type].splice(index, 1);
            }
        },
        calculateBudget: function () { // totals incomes and total expenses
            calculateTotal("inc");
            calculateTotal("exp");
            // Available budget left ( which will be income - expenses)
            datastr.budget = datastr.totals.inc - datastr.totals.exp;
            // calculate the percentages
            if (datastr.totals.inc > 0) {
                datastr.percentages = Math.round((datastr.totals.exp / datastr.totals.inc) * 100);
            } else {
                datastr.percentages = "-";
            }
        },
        calculatepercentage: function () {
            datastr.allitems.exp.forEach(function (cur) {
                cur.percentagecalculator(datastr.totals.inc);
            });
        },
        getpercentage: function () {
            var allperc = datastr.allitems.exp.map(function (cur) {
                return cur.getp();
            });
            return allperc;
        },
        returnBudget: function () {
            return {income: datastr.totals.inc, expense: datastr.totals.exp, percentage: datastr.percentages, budget: datastr.budget};
        },
        testing: function () {
            console.log(datastr);
        }
    };
})();
/* ---------------------------------------------------------------------------------*/
var uiController = (function () {
    var domstrings = {
        select: ".select",
        textAS: ".text-area-space",
        textAST: ".text-area-space1",
        toggicon: ".toggicon",
        incomelist: ".left",
        expenselist: ".right",
        budget: ".budget",
        incomeLabel: ".incomelabel",
        expenseLabel: ".expenselabel",
        percentagelabel: ".appear",
        container: ".container",
        classp: ".item--percentage",
        datelabel: ".data",

    };
    var formatNumbers =  function(num, type){
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    var nodeListForEach = function (Nlist, callback) {
        for (var i = 0; i < Nlist.length; i++) {
            callback(Nlist[i], i);
        }
    };
    return {
        getinput: function () {
            return {
                select: document.querySelector(domstrings.select).value,
                inputarea: document.querySelector(domstrings.textAS).value,
                inputareasecond: parseFloat(document.querySelector(domstrings.textAST).value)
            };
        },
        addlistitem: function (obj, type) {
            var html,
                newhtml,
                element;
            // Create a html string with some placeholder text
            if (type === "inc") {
                element = domstrings.incomelist;
                html = '<div class="item-clear-fix"id = "inc-%id%"><div class="item-description">%des%</div><div class="item--value">%val%</div><div class="item--delete"><button class="item--delete-button"><i class="fa-regular fa-circle-xmark"></i></button></div>';
            } else if (type === "exp") {
                element = domstrings.expenselist;
                html = '<div class="item-clear-fix"id = "exp-%id%"><div class="item-description">%des%</div><div class="item--value">%val%</div><div class="item--percentage">21%</div><div class="item--delete"><button class="item--delete-button"><i class="fa-regular fa-circle-xmark"></i></button></div>';
            }
            // Replace the place holder with original data
            newhtml = html.replace("%id%", obj.type);
            newhtml = newhtml.replace("%des%", obj.textas);
            newhtml = newhtml.replace("%val%",formatNumbers(obj.textast, type));
            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
        },
        deletelistitems: function (selectorid) {
            var el = document.getElementById(selectorid);
            el.parentNode.removeChild(el);
        },
        clearFeilds: function () {
            var feilds,
                feildsArray;
            feilds = document.querySelectorAll(domstrings.textAS + ", " + domstrings.textAST);
            feildsArray = Array.prototype.slice.call(feilds);
            feildsArray.forEach(function (current, index, array) {
                current.value = "";
            });
            feildsArray[0].focus();
        },
        displaybudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'; 
            document.querySelector(domstrings.budget).textContent = formatNumbers(obj.budget, type);
            document.querySelector(domstrings.expenseLabel).textContent = formatNumbers(obj.expense, 'exp');
            document.querySelector(domstrings.incomeLabel).textContent = formatNumbers(obj.income, 'inc');
            if (obj.percentage !== Infinity && obj.percentage !== "-") {
                document.querySelector(domstrings.percentagelabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(domstrings.percentagelabel).textContent = "-";
            }
        },
        displaypercentagelabels: function (percentages) {
            var feilds = document.querySelectorAll(domstrings.classp);
            nodeListForEach(feilds, function (current, index) { //
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "-";
                }
            });
        }, 
        displaymonth: function(){
            var now = new Date();
            var year = new Date().getFullYear();
            var month = now.getMonth();
            var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'Jully', 'Agust', 'Semptember', 'october', 'November', 'December']
            document.querySelector(domstrings.datelabel).textContent = 'Available budget in ' + months[month] + ' ' + year;
        },
        changetype: function(){
            var feilds = document.querySelectorAll(
                domstrings.select + ',' + domstrings.textAS + ',' + domstrings.textAST);
            nodeListForEach(feilds, function(curr){
                curr.classList.toggle('one')
             });
         document.querySelector(domstrings.toggicon).classList.toggle("oni")
        },
        getstrings: function () {
            return domstrings;
        }
    };
})();
/* ---------------------------------------------------------------------------------*/
var modulecontroller = (function (budgCtrl, uictrl) {
    var Setup = function () {
        var dom = uictrl.getstrings();
        document.querySelector(dom.toggicon).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (e) {
            if (e.KeyCoe === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(dom.container).addEventListener("click", ctrldeleteitem);
        document.querySelector(dom.select).addEventListener("change", uictrl.changetype);
    };
    var updateBudget = function () { // Calculate the budget
        budgCtrl.calculateBudget();
        // Return the budget
        var budget = budgCtrl.returnBudget();
        // Display the budget to UI
        uictrl.displaybudget(budget);
    };
    var updatePercentage = function () { // calculate percentages
        budgCtrl.calculatepercentage();
        // Read the percentages
        var percentagecall = budgCtrl.getpercentage();
        // Display the updated budget to UI
        uictrl.displaypercentagelabels(percentagecall);
    };
    var ctrlAddItem = function () { // get Feild Gat
        var input = uictrl.getinput();
        // Add item to budget controller
        if (input.inputarea !== "" && !isNaN(input.inputareasecond) && input.inputareasecond > 0) {
            var newitem = budgCtrl.additem(input.select, input.inputarea, input.inputareasecond);
            // Add item to the UI

            uiController.addlistitem(newitem, input.select);
            // Clear input feilds
            uiController.clearFeilds();
            // Calculate, update and display budget
            updateBudget();
            // update percentage
            updatePercentage();
        }
    };
    var ctrldeleteitem = function (e) {
        var itemid,
            splitid,
            type,
            id;
        itemid = e.target.parentNode.parentNode.parentNode.id;
        if (itemid) {
            splitid = itemid.split("-");
            type = splitid[0];
            id = parseInt(splitid[1]);
            // delete item from data structure
            budgCtrl.deleteiten(type, id);
            // delete item for UI
            uictrl.deletelistitems(itemid);
            // update and show new budget
            updateBudget();
            updatePercentage();
        }
    };
    return {
        init: function () {
            console.log("Application has started");
            uictrl.displaymonth();
            uictrl.displaybudget({income: 0, expense: 0, percentage: "-", budget: 0});
            Setup();
        }
    };
})(budgetcontroller, uiController);
modulecontroller.init();
