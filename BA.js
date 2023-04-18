var budgetcontroller = (function () {
    var datastr = {
        allitems: {
            exp: [],
            inc: []
        },
        totals: {
            totalincome: 0,
            totalexpense: 0
        }
    }
    var expense = function (type, textas, textast) {
        this.type = type;
        this.textas = textas;
        this.textast = textast;
    };
    var income = function (type, textas, textast) {
        this.type = type;
        this.textas = textas;
        this.textast = textast;
    };
    return {
        additem: function (type, value, amount) {
            var newitem;
            // create newid
            if (datastr.allitems[type].length > 0) {
                id = datastr.allitems[type][datastr.allitems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // creates new item based on exp or inc
            if (type == 'exp') {
                newitem = new expense(id, value, amount);
            } else if (type == 'inc') {
                newitem = new income(id, value, amount);
            }
            // push that item into the datastructure
            datastr.allitems[type].push(newitem);
            // return the new element
            return newitem;
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
        incomelist: ".in",
        expenselist: ".ein"
    };
    return {
        getinput: function () {
            return {
                select: document.querySelector(domstrings.select).value,
                inputarea: document.querySelector(domstrings.textAS).value,
                inputareasecond: document.querySelector(domstrings.textAST).value
            };
        },
        addlistitem: function (obj, type) 
        {
                var html, newhtml, elementdom;
                // Create a html string with some placeholder text
                if (type === "inc") {
                    elementdom = domstrings.incomelist;
                    html = '<div class="left"><h2 class="in">Income</h2><div class="item-clear-fix"id = "income-%id%"><div class="item-description">%description%</div><div class="item--value">%value%</div><div class="item--percentage">21%</div><div class="item--delete"><button class="item--delete-button"><img class="toggicon2" src="green-check-mark-icon-circle-tick-symbol-color-vector-illustration-isolated-white-background-135721241.jpg" alt=""></button></div></div></div>';
                } else if (type === "exp") {
                    elementdom = domstrings.expenselist;
                    html = '<div class="right"><h2 class="ein">Expense</h2><div class="item-clear-fix" id = "expense-%id%"><div class="item-description">%description%</div><div class="item--value">%value%</div><div class="item--percentage">21%</div><div class="item--delete"><button class="item--delete-button"><img class="toggicon2" src="green-check-mark-icon-circle-tick-symbol-color-vector-illustration-isolated-white-background-135721241.jpg" alt=""></button></div></div></div>';
                }
                // Replace the place holder with original data
                newhtml = html.replace('%id%', obj.type);
                newhtml = newhtml.replace('%description%', obj.textas);
                newhtml = newhtml.replace('%value%', obj.textast);
            // insert html into DOM
            document.querySelector(elementdom).insertAdjacentElement('beforeend', newhtml);
        },
        getstrings : function () {
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
    };
    var ctrlAddItem = function () { // get Feild Gat
        var input = uictrl.getinput();
        // Add item to budget controller
        var newitem = budgCtrl.additem(input.select, input.inputarea, input.inputareasecond);
        // Add item to the UI
        uiController.addlistitem(newitem, input.select);
        // Calculate the budget
        // Display the budget to UI
    };
    return {
        init: function () {
            console.log('Application has started');
            Setup();
        }
    }
})(budgetcontroller, uiController);
modulecontroller.init();
