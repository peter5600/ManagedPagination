class ManagedPagination {
    //Private fields Not working rn change later
    divToReplace;
    pages;
    itemsPerPage;
    itemCount;
    paginationLength;
    elementID; //unique id that can be used to allow multiple paginations on page at the same time
    method;
    callback;
    failedState;
    supportedMethods = ["preloaded", "formSimple", "formComplex", "custom"];
    requiredValues;
    handlePageTransition;
    showFirstAndLastPage;

    createPaginationElement() {
        let paginationDiv = document.createElement('div');
        paginationDiv.id = this.elementID;
        paginationDiv.classList.add('noselect')
        paginationDiv.classList.add('pagination')

        let leftArrow = document.createElement('a');
        leftArrow.id = "previousPage";
        if (typeof this.fontAwesomePreviousArrow == 'undefined') {
            leftArrow.innerHTML = "&laquo;";
        } else {
            leftArrow.innerHTML = this.fontAwesomePreviousArrow;
        }

        let rightArrow = document.createElement('a');
        rightArrow.id = "nextPage";
        if (typeof this.fontAwesomeNextArrow == 'undefined') {
            rightArrow.innerHTML = "&raquo;";
        } else {
            rightArrow.innerHTML = this.fontAwesomeNextArrow;
        }


        let pageNumbersToShow = 0;
        if (this.pages < this.paginationLength && this.pages > 1) {
            pageNumbersToShow = this.pages;
        } else if (this.pages > 1) {
            pageNumbersToShow = this.paginationLength;
            paginationDiv.classList.add("dynamicPagination");
        } //dont include 1 page or less

        let pageNumbers = [];
        for (let i = 1; i <= pageNumbersToShow; i++) {
            let pageNumber = document.createElement('a');
            if (i == 1) {
                pageNumber.className = "paginationNumber active";
            } else {
                pageNumber.className = "paginationNumber";
            }
            pageNumber.innerHTML = i;
            pageNumbers.push(pageNumber);
        }

        paginationDiv.append(leftArrow);
        if(this.showFirstAndLastPage){
            let firstPage = document.createElement('a');
            firstPage.innerHTML = "1..";
            firstPage.addEventListener('click', () => {
                this.changePagination(1)//test change back to 1 when im done
            });
            paginationDiv.append(firstPage)
        }
        pageNumbers.forEach(p => {
            paginationDiv.append(p);
        })
        if(this.showFirstAndLastPage){
            let lastPage = document.createElement('a');
            lastPage.innerHTML = ".." + this.pages;
            lastPage.addEventListener('click', () => {
                this.changePagination(this.pages)
            });
            paginationDiv.append(lastPage)
        }
        paginationDiv.append(rightArrow);

        this.divToReplace.parentNode.replaceChild(paginationDiv, this.divToReplace);
    }

    nextPage(e) {
        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');
        const index = this.index(pagination.getElementsByClassName('active'), '.paginationNumber')
        let currentElement = parseInt(ActiveElement.innerHTML);
        if (currentElement + 1 <= this.pages) {
            ActiveElement.classList.remove('active');
            document.querySelectorAll('#' + this.elementID + ' > .paginationNumber').forEach((child) => {
                child.classList.remove('active')
            })
            if (pagination.classList.contains('dynamicPagination')) {
                //dynamic
                if (index + 1 > Math.floor(this.paginationLength / 2) && currentElement + Math.floor(this.paginationLength / 2) < this.pages) {
                    pagination.querySelectorAll('.paginationNumber').forEach(num => {
                        num.innerHTML = parseInt(num.innerHTML) + 1
                    })
                    document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index].classList.add('active')
                } else {
                    document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index + 1].classList.add('active')
                }
            } else {
                //not dynamic
                document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index + 1].classList.add('active')
            }

        }
        e.preventDefault();
    }

    previousPage(e) {
        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');
        const index = this.index(pagination.getElementsByClassName('active'), '.paginationNumber')//this is the issue
        let currentElement = parseInt(ActiveElement.innerHTML);


        if (currentElement - 1 > 0) {
            ActiveElement.classList.remove('active');
            document.querySelectorAll('#' + this.elementID + ' > .paginationNumber').forEach((child) => {
                child.classList.remove('active')
            })
            if (pagination.classList.contains('dynamicPagination')) {
                //dynamic
                if (currentElement - 1 > Math.floor(this.paginationLength / 2) && currentElement + Math.floor(this.paginationLength / 2) <= this.pages) {
                    pagination.querySelectorAll('.paginationNumber').forEach(num => {
                        num.innerHTML = parseInt(num.innerHTML) - 1
                    })
                    document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index].classList.add('active')
                } else {
                    document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index - 1].classList.add('active')
                }
            } else {
                //not dynamic
                document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index - 1].classList.add('active')
            }
        }
        e.preventDefault();
    }

    handlePaginationClick(e) {
        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');
        const index = this.index(pagination.getElementsByClassName('active'),'.paginationNumber')
        let currentElement = parseInt(ActiveElement.innerHTML);
        let currentTargetElement = this.index(e.currentTarget, '.paginationNumber');
        let currentTargetElementNum = parseInt(e.currentTarget.innerHTML)
        let difference = currentTargetElement - index;
        if (difference > 0) {
            if (currentElement + 1 <= this.pages) {
                ActiveElement.classList.remove('active');
                if (pagination.classList.contains('dynamicPagination')) {
                    //dynamic
                    if (index + (1 * difference) > Math.floor(this.paginationLength / 2) && currentElement + Math.floor(this.paginationLength / 2) < this.pages) {
                        if (currentElement < Math.ceil(this.paginationLength / 2)) {
                            difference -= (Math.floor(this.paginationLength / 2) - (index));
                        }
                        let counter = 0;
                        for (let i = 0; i < difference; i++) {
                            if (document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[this.paginationLength-1].innerHTML.trim() != this.pages) {
                                pagination.querySelectorAll('.paginationNumber').forEach(num => {
                                    num.innerHTML = parseInt(num.innerHTML) + 1
                                })
                            } else {
                                counter++;
                            }
                        }
                        document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[Math.floor(this.paginationLength / 2) + counter].classList.add('active')
                    } else {
                        document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[(index + (1 * difference))].classList.add('active')
                    }
                } else {
                    //not dynamic
                    document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[(index + (1 * difference))].classList.add('active')
                }
            }
        } else if (difference < 0) {
            difference = Math.abs(difference);
            if (currentElement - 1 > 0) {
                ActiveElement.classList.remove('active');
                if (pagination.classList.contains('dynamicPagination')) {
                    //dynamic
                    if (currentElement - 1 > Math.floor(this.paginationLength / 2) && currentTargetElementNum + Math.floor(this.paginationLength / 2) < this.pages) { //might need <=
                        if (currentElement > this.pages - 3) {
                            difference -= (Math.floor(this.paginationLength / 2) - (this.pages - currentElement));
                        }
                        let counter = 0;
                        for (let i = 0; i < difference; i++) {
                            if (document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[0].innerHTML.trim() != "1") {
                                pagination.querySelectorAll('.paginationNumber').forEach(num => {
                                    num.innerHTML = parseInt(num.innerHTML) - 1
                                })
                            } else {
                                counter++;
                            }
                        }
                        document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[Math.floor(this.paginationLength / 2) - counter].classList.add('active')
                    } else {
                        document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index - (1 * difference)].classList.add('active')
                    }
                } else {
                    //not dynamic
                    document.querySelectorAll('#' + this.elementID + ' > .paginationNumber')[index - (1 * difference)].classList.add('active')
                }
            }
        }
        this.handlePageTransition();
        e.preventDefault();
    }

    onLoadEventHandler() {
        document.querySelector('#' + this.elementID).querySelector("#nextPage").addEventListener('click', (e) => {
            this.nextPage(e);
            this.handlePageTransition();
        });

        document.querySelector('#' + this.elementID).querySelector("#previousPage").addEventListener('click', (e) => {
            this.previousPage(e);
            this.handlePageTransition();
        });


        let paginationNumbers = document.querySelector('#' + this.elementID).getElementsByClassName("paginationNumber");
        for (let i = 0; i < paginationNumbers.length; i++) {
            paginationNumbers[i].addEventListener('click', (e) => {
                this.handlePaginationClick(e);
                this.handlePageTransition();
            });
        }

    }

    index(node, selector = '*') { //JS equivalent of JQuery index
        if (NodeList.prototype.isPrototypeOf(node) || HTMLCollection.prototype.isPrototypeOf(node)) {
            node = node[0]
        }
        if(selector == '*'){
            return [...node.parentNode.children].indexOf(node);
        }else{
            return [...node.parentNode.querySelectorAll(selector)].indexOf(node);
        }
        
        
    }

    generateValidUniqueID() {
        /*let id = crypto.randomUUID();
        let chars = id.split('');
        //generate random num
        let letter = String.fromCharCode(Math.random() * (123 - 97) + 97); //dosent include 123 so a-z
        chars[0] = letter; //cant have first charecter in id be a number
        return chars.join('');*/
        return "reallyLongComplexID" + Math.floor((Math.random() * (1000 - 1) + 1));
    }

    handleOptionalValues(optionalValues) {
        console.log(optionalValues);
        if (typeof optionalValues == 'undefined' || optionalValues == null) {
            optionalValues = {};
        }
        if ('currentPage' in optionalValues) {
            this.currentPage = optionalValues['currentPage'];
        } else {
            this.currentPage = this.getCurrentPage();
        }
        console.log(this.currentPage);

        if ('itemsPerPage' in optionalValues) {
            this.itemsPerPage = optionalValues['itemsPerPage'];
        } else {
            this.itemsPerPage = 20;
        }

        if ('paginationLength' in optionalValues) {
            this.paginationLength = optionalValues['paginationLength'];
        } else {
            this.paginationLength = 7; //make sure this is odd it works from 1+ 
            //also it works if its greater than the current amount that can be displayed
        }

        if ('globalStyles' in optionalValues) {
            //list through all of the elements affected and append to page
            if ('nextPageBtn' in optionalValues['globalStyles']) {
                this.handleStyle(optionalValues, "#nextPage")
            }

            if ('previousPageBtn' in optionalValues['globalStyles']) {
                this.handleStyle(optionalValues, "#previousPage")
            }

            if ('paginationNumberTag' in optionalValues['globalStyles']) {
                this.handleStyle(optionalValues, ".paginationNumber")
            }
        }

        if ('localStyles' in optionalValues) {
            if ('nextPageBtn' in optionalValues['localStyles']) {
                this.handleStyle(optionalValues, `#${this.elementID} > #nextPage`, false)
            }

            if ('previousPageBtn' in optionalValues['localStyles']) {
                this.handleStyle(optionalValues, `#${this.elementID} > #previousPage`, false)
            }

            if ('paginationNumberTag' in optionalValues['localStyles']) {
                this.handleStyle(optionalValues, `#${this.elementID} > .paginationNumber`, false)
            }
        }

        if ('fontAwesome' in optionalValues) {
            if ('nextPageBtn' in optionalValues['fontAwesome']) {
                this.fontAwesomeNextArrow = optionalValues['fontAwesome']['nextPageBtn'];
            }
            if ('previousPageBtn' in optionalValues['fontAwesome']) {
                this.fontAwesomePreviousArrow = optionalValues['fontAwesome']['previousPageBtn'];
            }
        }

        if('showFirstAndLastPage' in optionalValues){
            if(optionalValues['showFirstAndLastPage']){
                this.showFirstAndLastPage = true;
            }
        }
    }

    handleStyle(optionalValues, selector, isGlobal = true) {
        let globalStyleTag = document.querySelector("#globalPaginationStyles");
        if (globalStyleTag == null) {
            globalStyleTag = document.createElement('style');
            globalStyleTag.id = "globalPaginationStyles";
            document.querySelector("head").appendChild(globalStyleTag); //check if they have a head if not append to html
        }
        let styleType;
        if (isGlobal) {
            styleType = 'globalStyles'
        } else {
            styleType = 'localStyles'
        }
        let objectName;
        if (selector.includes("#nextPage")) {
            objectName = "nextPageBtn";
        } else if (selector.includes("#previousPage")) {
            objectName = "previousPageBtn";
        } else if (selector.includes(".paginationNumber")) {
            objectName = "paginationNumberTag";
        }
        for (let index in optionalValues[styleType][objectName]) { //loop through all of the styles
            let styles = optionalValues[styleType][objectName][index];
            let string = '';
            if ('media' in styles) {
                if ('min' in styles['media'] && 'max' in styles['media']) {
                    string += `@media screen and (max-width: ${styles['media']['max']}) and (min-width: ${styles['media']['min']}){\n`
                } else if ('min' in styles['media']) {
                    string += `@media screen and (min-width: ${styles['media']['min']}){\n`
                } else if ('max' in styles['media']) {
                    string += `@media screen and (max-width: ${styles['media']['max']}){\n`
                }
            }
            if ('pseudo' in styles) {
                string += `${selector}${styles['pseudo']}{\n`;
            } else {
                string += `${selector}{\n`;
            }
            for (const style in styles) {
                if (style != "pseudo" && style != "media") { //run a loop that adds them all inside a single tag rather than a tag for all of them
                    string += `\t${style}: ${styles[style]};\n`;
                }
            }
            if ('media' in styles) {
                string += `}\n`;
            }
            string += `}\n`;
            globalStyleTag.appendChild(document.createTextNode(string));
        }
    }

    getCurrentPage(paramName = "pagenum") {
        //get current page num from url
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.has(paramName)) {
            const pageNum = urlParams.get(paramName);
            if (!isNaN(pageNum)) {
                return pageNum
            }
        }
        return 1;


    }

    handlePreLoaded() {
        const pagination = document.querySelector("#" + this.elementID);
        this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
        document.querySelectorAll(this.requiredValues['container'] + ' > ' + this.requiredValues['item']).forEach(child => {
            child.style = "display : none;";
        });
        //we have current page and items per page
        [...document.querySelectorAll(this.requiredValues['container'] + ' > ' + this.requiredValues['item'])].slice(0 + ((this.currentPage - 1) * this.itemsPerPage), this.itemsPerPage + ((this.currentPage - 1) * this.itemsPerPage)).forEach((child) => {
            child.style = "display: block";
        });
    }

    handleFormSimple() {
        //create a custom function for page transition
        let paramName;
        if (typeof this.requiredValues['paramName'] != 'undefined') {
            paramName = this.requiredValues['paramName'];
        } else {
            paramName = 'pageNum';
        }
        this.handlePageTransition = () => {
            if (typeof this.requiredValues['callback'] != 'undefined') {
                this.requiredValues['callback']();
            }
            let form;
            form = document.createElement('form');
            form.id = "formToRefreshPage" + this.elementID;
            let endpoint;
            if (typeof this.requiredValues['endpoint'] == 'undefined') {
                endpoint = window.location.href;
            } else {
                endpoint = this.requiredValues['endpoint'];
            }
            form.action = endpoint;
            form.method = 'GET';
            document.querySelector('body').appendChild(form);

            let pageNum = document.createElement('input');
            pageNum.type = 'hidden';
            pageNum.name = paramName;
            const pagination = document.querySelector("#" + this.elementID);
            this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
            pageNum.value = this.currentPage;
            form.appendChild(pageNum);
            form.submit();
        }
        window.addEventListener('load', () => {
            const pageNum = getCurrentPage(paramName);
            //set pagenum equal to this num need to cycle across to this page
            this.requiredValues['onLoad'](pageNum, this.itemsPerPage);
        })
    }

    handleFormComplex() {
        this.handlePageTransition = () => {
            if (typeof this.requiredValues['callback'] != 'undefined') {
                this.requiredValues['callback']();
            }
            const form = document.querySelector(this.requiredValues['formSelector']);
            if (NodeList.prototype.isPrototypeOf(node) || HTMLCollection.prototype.isPrototypeOf(node)) {
                form = form[0];//if its an array of elements select the first one
            }
            let pageNum = document.createElement('input');
            pageNum.type = 'hidden';
            pageNum.name = this.requiredValues['formInputName'];
            const pagination = document.querySelector("#" + this.elementID);
            this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
            pageNum.value = this.currentPage;
            form.appendChild(pageNum);
            form.submit();
        }
        //handle onload event
        window.addEventListener('load', () => {
            const pageNum = this.requiredValues['pageNum'];
            this.requiredValues['onLoad'](pageNum, this.itemsPerPage);
        })
    }

    handleCustom() {
        const pagination = document.querySelector("#" + this.elementID);
        this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
        this.requiredValues['callback'](this.currentPage, this.itemsPerPage);
    }

    changePagination(number){
        //this func will take a page num and will change the existing pagination to that page
        //used for handling ..1 and ..max page as well as any custom function that needs to change the pagination without re generating it
        
        //make sure number isn't less than 1 or greater than pageCount
        if(number < 1 || number > this.pages){
            //throw an error
        }

        //unselect the active element
        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');
        ActiveElement.classList.remove('active');
        const elements = pagination.querySelectorAll(".paginationNumber")
        

        // determine if it should be in the middle or noty
        if(number > Math.ceil(this.paginationLength / 2) && number + Math.floor(this.paginationLength / 2) < this.pages){
            //this is a middle number
            for(let i =0; i < Math.ceil(number/2);i++){
                console.log("beginning i",i);
                elements[i].innerHTML = (number - Math.ceil(number/2)) + i;
            }
            console.log("middle i", Math.ceil(number/2));
            elements[Math.ceil(number/2)].innerHTML = number;
            elements[Math.ceil(number/2)].classList.add('active');
            for(let i = this.paginationLength -1; i > Math.ceil(number/2); i--){
                console.log("end i",i);
                elements[i].innerHTML = (Math.floor(number/2)) +i;
            }
            
        }else if(number <= Math.ceil(this.paginationLength / 2)){
            //left side of middle number
            console.log('im on the left side')
            for(let i =1; i <= this.paginationLength; i++){
                elements[i -1].innerHTML = i;
                if(i == number){
                    elements[i -1].classList.add('active');
                }
            }
        }else if(number + Math.floor(this.paginationLength / 2) >= this.pages){
            //right side of middle number
            console.log('im on the right side')
            for(let i = this.pages, j = this.paginationLength-1; i > this.pages - this.paginationLength; i--, j--){
                elements[j].innerHTML = i;
                if(i == number){
                    elements[j].classList.add('active')
                }
            }
        }
        //to do this do the check i have in handleclick which checks if it should revolved the pagination or move the active element
        //if it is in the centre do the x numbers to the left and right of it 
        //if its a moving one determine whether its less than or greater than if its less than go from 1 and draw them if its greater go from max and draw down

    }

    handleRequiredValues(method, requiredValues) {
        /* structure
            Method : String - What method is it
            preloaded:
                //Simplest solution is to load all of the elements on the screen and hide them and then display
                //Them in section
                container : String - This is the div or container that has all of the elements in
                item : String - This is the selector that will be displayed 
            formSimple:
                //This is just create a form and submit it
                paramName : OPTUONAL String - The name of the param in the URL
                callback : OPTIONAL function - Before its sent this callback is called
                onLoad: function - Loaded on page load
                endPoint : OPTIONAL string - The endpoint for the form to send the information
            formComplex:
                //This is find an existing form and add the value then trigger the submit
                callback : OPTIONAL function - Before its sent this callback is called
                onLoad: function - Loaded on page load
                formSelector : String - This is the name of the form i am adding the input to.
                formInputName : String - This is the name of the element added to the form.
                pageNum : Int - This is the current page num can't be grabbed via GET with param name because this form could use
                POST which clears any URL params. I could ask them to include it in a query string but that would involve extra effort 
                could be a future feature though to support telling me the pageNum or passing it in a query string that I can grab for them
                
            custom:
                //Designed for ajax calls to get items rather than for refreshing the page but 
                //I want to add a set page function which could be used if they want to refresh the page inside of this function
                callback : function - Callback that passes index and size so that callback can display them or filter away
            
            Some of these can be done in multiple ways like having a form with existing inputs or not
            Make sure to show all of the methods and probably change the optional system to different methods that exist
            within the existing method
        */
        let m = method.trim().toLowerCase()
        if (this.supportedMethods.includes(m)) {
            this.requiredValues = requiredValues;
            switch (m) {
                case "preloaded":
                    if (typeof requiredValues['container'] != 'undefined' &&
                        typeof requiredValues['item'] != 'undefined') {
                        this.handlePageTransition = this.handlePreLoaded;
                        this.handlePageTransition();//call the first time
                    } else {
                        //throw error
                    }
                    break;
                case "formSimple":
                    if (typeof requiredValues['paramName'] != 'undefined' &&
                        typeof requiredValues['onLoad'] != 'undefined' &&
                        typeof requiredValues['method'] != 'undefined') {
                        this.handleFormSimple();
                        //The onload function will be called in the window.onLoad 
                    } else {
                        //throw error
                    }
                    break;
                case "formComplex":
                    if (typeof this.requiredValues['onLoad'] != 'undefined' &&
                        typeof this.requiredValues['formSelector'] != 'undefined' &&
                        typeof this.requiredValues['formInputName'] != 'undefined' &&
                        typeof this.requiredValues['pageNum'] != 'undefined'){
                            this.handleFormComplex();
                        }
                        break;
                case "custom":
                    if (typeof requiredValues['callback'] != 'undefined') {
                        const pagination = document.querySelector("#" + this.elementID);
                        this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
                        requiredValues['callback'](this.currentPage, this.itemsPerPage);
                        this.handlePageTransition = this.handleCustom;
                    } else {
                        //throw error
                    }
                    break;
            }
        } else {
            //throw error 
            throw new Error("Please choose a method, from the list of available methods.\n" + this.supportedMethods)
        }
    }
    constructor(divToReplace, itemCount, method, requiredValues, optionalValues = null) { //take an object instead of props so i can have any amoubt any orddr
        this.divToReplace = divToReplace;

        this.itemCount = itemCount;
        this.elementID = this.generateValidUniqueID();

        this.handleOptionalValues(optionalValues);
        this.pages = Math.ceil(this.itemCount / this.itemsPerPage);
        console.log("pages", this.pages)
        this.createPaginationElement();
        this.handleRequiredValues(method, requiredValues);

        window.addEventListener("load", () => {
            this.onLoadEventHandler();
        });
    }
}

//Add the 1.. and last page.. thing in pagination
//Only show 1.. and last if the last and first cant be seen
//work on changePagination func

//Features
//Make sure to change lets to consts where I can
//Look into sending the items per page to the backend because that value can change add this when I add the dropdown to change it
//Handle changing the page let users define a callback that will be passed the values or let them return the values to us
//add custom events that users can add themselves
//have a pre load event that lets them load the next n number of pages for the user
//add first page last page support so users can see last page
//browser support check what limits browser support i think UUID will affect the most
//add optional dropdown that lets them change the number of pages
//work on making fully responsive and work with different font sizes
//eventuyally add server side support for stuff like laravel etc
//heavily comment the functions with the xml style comments
//instead of strings use enums instead just make a const object and run object.freeze on it
//add key binds so that users can use arrow keys or specific keys
//Make it work with an even nuber of paginationLength
//Change item count based on the method so preloaded it can be calculated the rest it has to be entered

//Github stuff
//define all of the options
//the classes that it uses 
//how it works
//the possible errors and why they can be called
//everything else that a dev might wanna know if they are