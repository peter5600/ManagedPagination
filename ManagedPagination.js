class ManagedPagination {
    //Private fields Not working rn change later
    divToReplace;
    pages;
    itemsPerPage;
    items;
    paginationLength;
    elementID; //unique id that can be used to allow multiple paginations on page at the same time

    createPaginationElement() {
        let paginationDiv = document.createElement('div');
        paginationDiv.id = this.elementID;
        paginationDiv.classList.add('noselect')
        paginationDiv.classList.add('pagination')

        let leftArrow = document.createElement('a');
        leftArrow.id = "previousPage";
        leftArrow.innerHTML = "&laquo;";

        let rightArrow = document.createElement('a');
        rightArrow.id = "nextPage";
        rightArrow.innerHTML = "&raquo;";

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
        });

        document.querySelector('#' + this.elementID).querySelector("#previousPage").addEventListener('click', (e) => {
            this.previousPage(e);
        });


        let paginationNumbers = document.querySelector('#' + this.elementID).getElementsByClassName("paginationNumber");
        for (let i = 0; i < paginationNumbers.length; i++) {
            paginationNumbers[i].addEventListener('click', (e) => {
                this.handlePaginationClick(e);
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

    handleOptionalValues(optionalValues){
        console.log(optionalValues);
        if('currentPage' in optionalValues){
            this.currentPage = optionalValues['currentPage'];
        }else{
            this.currentPage = 1;
        }

        if('itemsPerPage' in optionalValues){
            this.itemsPerPage = optionalValues['itemsPerPage'];
        }else{
            this.itemsPerPage = 20;
        }

        if('paginationLength' in optionalValues){
            this.paginationLength = optionalValues['paginationLength'];
        }else{
            this.paginationLength = 7;//make sure this is odd it works from 1+ 
            //also it works if its greater than the current amount that can be displayed
        }



    }

    constructor(divToReplace, items, optionalValues) { //take an object instead of props so i can have any amoubt any orddr
        this.divToReplace = divToReplace;
        this.handleOptionalValues(optionalValues);
        
        this.items = 200;
        this.pages = Math.ceil(this.items / this.itemsPerPage);
        this.elementID = this.generateValidUniqueID();
        this.createPaginationElement()

        window.addEventListener("load", () => {
            this.onLoadEventHandler();
        });
    }
}

//Features
//Mandatory values and optional - read optional with anm object 
//Handle changing the page let users define a callback that will be passed the values or let them return the values to us
//styling let the users change all of the styles that are avaliable
//add font awesome support
//add font support
//add custom events that users can add themselves
//have a pre load event that lets them load the next n number of pages for the user
//add first page last page support so users can see last page
//get page from url support 
//browser support check what limits browser support i think UUID will affect the most


//Github stuff
//define all of the options
//the classes that it uses 
//how it works
//the possible errors and why they can be called
//everything else that a dev might wanna know if they are 