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
    supportedMethods = ["preloaded", "get", "post", "custom"];

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
        pageNumbers.forEach(p => {
            paginationDiv.append(p);
        })
        paginationDiv.append(rightArrow);

        this.divToReplace.parentNode.replaceChild(paginationDiv, this.divToReplace);
    }

    nextPage(e) {
        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');
        const index = this.index(pagination.getElementsByClassName('active'))
        let currentElement = parseInt(ActiveElement.innerHTML);
        if (currentElement + 1 <= this.pages) {
            ActiveElement.classList.remove('active');
            document.querySelectorAll('#' + this.elementID + ' > *').forEach((child) => {
                child.classList.remove('active')
            })
            if (pagination.classList.contains('dynamicPagination')) {
                //dynamic
                if (index + 1 > Math.ceil(this.paginationLength / 2) && currentElement + Math.floor(this.paginationLength / 2) < this.pages) {
                    pagination.querySelectorAll('.paginationNumber').forEach(num => {
                        num.innerHTML = parseInt(num.innerHTML) + 1
                    })
                    document.querySelectorAll('#' + this.elementID + ' > *')[index].classList.add('active')
                } else {
                    document.querySelectorAll('#' + this.elementID + ' > *')[index + 1].classList.add('active')
                }
            } else {
                //not dynamic
                document.querySelectorAll('#' + this.elementID + ' > *')[index + 1].classList.add('active')
            }

        }
        e.preventDefault();
    }

    previousPage(e) {
        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');
        const index = this.index(pagination.getElementsByClassName('active'))
        let currentElement = parseInt(ActiveElement.innerHTML);


        if (currentElement - 1 > 0) {
            ActiveElement.classList.remove('active');
            document.querySelectorAll('#' + this.elementID + ' > *').forEach((child) => {
                child.classList.remove('active')
            })
            if (pagination.classList.contains('dynamicPagination')) {
                //dynamic
                if (currentElement - 1 > Math.floor(this.paginationLength / 2) && currentElement + Math.floor(this.paginationLength / 2) <= this.pages) {
                    pagination.querySelectorAll('.paginationNumber').forEach(num => {
                        num.innerHTML = parseInt(num.innerHTML) - 1
                    })
                    document.querySelectorAll('#' + this.elementID + ' > *')[index].classList.add('active')
                } else {
                    document.querySelectorAll('#' + this.elementID + ' > *')[index - 1].classList.add('active')
                }
            } else {
                //not dynamic
                document.querySelectorAll('#' + this.elementID + ' > *')[index - 1].classList.add('active')
            }
        }
        e.preventDefault();
    }

    handlePaginationClick(e) {

        const pagination = document.querySelector("#" + this.elementID);
        let ActiveElement = pagination.querySelector('.active');

        const index = this.index(pagination.getElementsByClassName('active'))
        let currentElement = parseInt(ActiveElement.innerHTML);
        let currentTargetElement = this.index(e.currentTarget);
        let currentTargetElementNum = parseInt(e.currentTarget.innerHTML)
        let difference = currentTargetElement - index;
        if (difference > 0) {
            if (currentElement + 1 <= this.pages) {
                ActiveElement.classList.remove('active');
                document.querySelectorAll('#' + this.elementID + ' > *').forEach((child) => {
                    child.classList.remove('active')
                })
                if (pagination.classList.contains('dynamicPagination')) {
                    //dynamic
                    if (index + (1 * difference) > Math.ceil(this.paginationLength / 2) && currentElement + Math.floor(this.paginationLength / 2) < this.pages) {
                        if (currentElement < Math.ceil(this.paginationLength / 2)) {
                            difference -= (Math.floor(this.paginationLength / 2) - (index - 1));
                        }
                        let counter = 0;
                        for (let i = 0; i < difference; i++) {
                            if (document.querySelectorAll('#' + this.elementID + ' > *')[this.paginationLength].innerHTML.trim() != this.pages) {
                                pagination.querySelectorAll('.paginationNumber').forEach(num => {
                                    num.innerHTML = parseInt(num.innerHTML) + 1
                                })
                            } else {
                                counter++;
                            }
                        }
                        document.querySelectorAll('#' + this.elementID + ' > *')[Math.ceil(this.paginationLength / 2) + counter].classList.add('active')
                    } else {
                        document.querySelectorAll('#' + this.elementID + ' > *')[(index + (1 * difference))].classList.add('active')
                    }
                } else {
                    //not dynamic
                    document.querySelectorAll('#' + this.elementID + ' > *')[(index + (1 * difference))].classList.add('active')
                }

            }
        } else if (difference < 0) {
            difference = Math.abs(difference);
            if (currentElement - 1 > 0) {
                ActiveElement.classList.remove('active');
                document.querySelectorAll('#' + this.elementID + ' > *').forEach((child) => {
                    child.classList.remove('active')
                })
                if (pagination.classList.contains('dynamicPagination')) {
                    //dynamic
                    if (currentElement - 1 > Math.floor(this.paginationLength / 2) && currentTargetElementNum + Math.floor(this.paginationLength / 2) < this.pages) { //might need <=
                        if (currentElement > this.pages - 3) {
                            difference -= (Math.floor(this.paginationLength / 2) - (this.pages - currentElement));
                        }
                        let counter = 0;
                        for (let i = 0; i < difference; i++) {
                            if (document.querySelectorAll('#' + this.elementID + ' > *')[1].innerHTML.trim() != "1") {
                                pagination.querySelectorAll('.paginationNumber').forEach(num => {
                                    num.innerHTML = parseInt(num.innerHTML) - 1
                                })
                            } else {
                                counter++;
                            }
                        }
                        document.querySelectorAll('#' + this.elementID + ' > *')[Math.ceil(this.paginationLength / 2) - counter].classList.add('active')
                    } else {
                        document.querySelectorAll('#' + this.elementID + ' > *')[index - (1 * difference)].classList.add('active')
                    }
                } else {
                    //not dynamic
                    document.querySelectorAll('#' + this.elementID + ' > *')[index - (1 * difference)].classList.add('active')
                }
            }
        }
        e.preventDefault();
    }

    onLoadEventHandler() {
        document.querySelector('#' + this.elementID).querySelector("#nextPage").addEventListener('click', (e) => {
            this.nextPage(e);
            this.handleCallback();
        });

        document.querySelector('#' + this.elementID).querySelector("#previousPage").addEventListener('click', (e) => {
            this.previousPage(e);
            this.handleCallback();
        });


        let paginationNumbers = document.querySelector('#' + this.elementID).getElementsByClassName("paginationNumber");
        for (let i = 0; i < paginationNumbers.length; i++) {
            paginationNumbers[i].addEventListener('click', (e) => {
                this.handlePaginationClick(e);
                this.handleCallback();
            });
        }

    }

    index(node) { //JQuery equivalent of index
        if (NodeList.prototype.isPrototypeOf(node) || HTMLCollection.prototype.isPrototypeOf(node)) {
            node = node[0]
        }
        return [...node.parentNode.children].indexOf(node)
    }

    generateValidUniqueID() {
        let id = crypto.randomUUID();
        let chars = id.split('');
        //generate random num
        let letter = String.fromCharCode(Math.random() * (123 - 97) + 97); //dosent include 123 so a-z
        chars[0] = letter; //cant have first charecter in id be a number
        return chars.join('');
    }

    handleOptionalValues(optionalValues) {
        console.log(optionalValues);
        if (typeof optionalValues == 'undefined') {
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

    getCurrentPage() {
        //get current page num from url
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.has('pagenum')) {
            const pageNum = urlParams.get('pagenum');
            if (!isNaN(pageNum)) {
                return pageNum
            }
        }
        return 1;


    }

    handleCallback() {
        const pagination = document.querySelector("#" + this.elementID);
        this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
        this.callback(this.currentPage, this.itemsPerPage);
    }

    handlePreLoaded(requiredValues) {
        const pagination = document.querySelector("#" + this.elementID);
        this.currentPage = parseInt(pagination.getElementsByClassName('active')[0].innerHTML);
        //we have current page and items per page
        [...document.querySelectorAll(requiredValues['itemsSelector'] + ' > *')].slice(0 + ((this.currentPage -1) * this.itemsPerPage), this.itemsPerPage + ((this.currentPage -1) * this.itemsPerPage)).forEach((child) => {
            console.log(child)
        });
    }

    handleGet(requiredValues) {

    }

    handlePost(requiredValues) {

    }

    handleCustom(requiredValues) {

    }

    handleRequiredValues(method, requiredValues) {
        /* structure
            Method : String - What method is it
            preloaded:
                itemsSelector : HTMLCollection - This is the div or container that has all of the elements in
                itemSelector : String - This is the selector that will be displayed 
            get:
                paramName : String - The name of the param in the URL
                callback : OPTIONAL function - Before its sent this callback is called
                onLoad: function - Loaded on page load because its a GET
            post: 
                formElementName : String - name of form element to be posted to the backend
                formname : OPTIONAL String - form name that the element should be added to
                endPoint : String - End point to post to
                callback : OPTIONAL function - Before its posted this function will be run
                onLoad : function - Loaded on page load 
            custom:
                callback : function - Callback that passes index and size so that callback can display them or filter away
                
        */
        let m = method.trim().toLowerCase()
        if (this.supportedMethods.includes(m)) {
            switch (m) {
                case "preloaded":
                    if (typeof requiredValues['itemsSelector'] != 'undefined' && typeof requiredValues['itemSelector'] != 'undefined') {
                        this.handlePreLoaded(requiredValues);
                    } else {
                        //throw error
                    }
                    break;
                case "get":
                    this.handleGet(requiredValues);
                    break;
                case "post":
                    this.handlePost(requiredValues);
                    break;
                case "custom":
                    if (typeof requiredValues['callback'] != 'undefined') {
                        this.handleCustom(requiredValues);
                    } else {
                        //throw error
                    }

                    break;
            }
        } else {
            //throw error 
            throw new Error("Please choose a method, from the list of available methods.")
        }
    }
    constructor(divToReplace, itemCount, method, requiredValues, optionalValues = null) { //take an object instead of props so i can have any amoubt any orddr
        this.divToReplace = divToReplace;

        this.itemCount = 200;
        this.elementID = this.generateValidUniqueID();

        if (optionalValues != null) {
            this.handleOptionalValues(optionalValues);
        }
        this.pages = Math.ceil(this.itemCount / this.itemsPerPage);
        this.createPaginationElement();
        this.handleRequiredValues(method,requiredValues);

        window.addEventListener("load", () => {
            this.onLoadEventHandler();
        });
    }
}


//To handle method i will ask for the method values with is a required object
//There will always be the method : "" param that takes the method and then based on this i check for the required values
//different methods
//pre loaded, GET, POST, custom
//Pre loaded - All of the elements are present in the DOM but need to be handled in a callback
//GET the elements are loaded based on page number so i need to use a GET method to refresh the page and pass the page num
//POST same as get but loaded with a post param inside a form
//custom i just have a callback function the user handles everything inside themselves this includes ajax


//Features
//Handle changing the page let users define a callback that will be passed the values or let them return the values to us
//add custom events that users can add themselves
//have a pre load event that lets them load the next n number of pages for the user
//add first page last page support so users can see last page
//get page from url support 
//browser support check what limits browser support i think UUID will affect the most
//add optional dropdown that lets them change the number of pages
//work on making fully responsive and work with different font sizes 
//maybe look into making a style manager class to split this up and reduce file size
//eventuyally add server side support for stuff like laravel etc
//add get support so that when a page is clicked it adds it to the url and reloads the page
//add post support as well
//heavily comment the functions with the xml style comments
//instead of strings use enums instead
//look into using AJAX methods as well as what is supported

//add style support for active as well basically everything i have in the existing css file as well as media queries

//methods to load the content
//have everything loaded all at once.
//use get statements and recieve everything would need to know the total number of items for this approach
//same as get but support post statements as well again would need the total number of items
//ill need a new statement for this like method: which can be preloaded, get or post

//Github stuff
//define all of the options
//the classes that it uses 
//how it works
//the possible errors and why they can be called
//everything else that a dev might wanna know if they are 