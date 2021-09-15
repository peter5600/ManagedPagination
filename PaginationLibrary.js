class PeterPagination {

    //Private fields
    #divToReplace;
    #pages;
    #itemsPerPage;
    #items;

    #createPaginationElement() {
        let paginationDiv = document.createElement('div');
        paginationDiv.id = "pagination";

        let leftArrow = document.createElement('a');
        leftArrow.id = "previousPage";
        leftArrow.innerHTML = "&laquo;";

        let rightArrow = document.createElement('a');
        rightArrow.id = "nextPage";
        rightArrow.innerHTML = "&raquo;";

        let pageNumbersToShow = 0;
        if (this.#pages < 7 && this.#pages > 1) {
            pageNumbersToShow = this.#pages;
        } else if (this.#pages > 1) {
            pageNumbersToShow = 7;
            paginationDiv.className = "dynamicPagination";
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

        this.#divToReplace.parentNode.replaceChild(paginationDiv, this.#divToReplace);
    }

    #nextPage(e) {
        let oldActiveElement = document.querySelector("#pagination").querySelector('.active');
        const index = this.#index(document.getElementById('pagination'), document.getElementsByClassName('active'))
        let currentElement = parseInt(oldActiveElement.innerHTML);
        if(currentElement + 1 <= pages){
            oldActiveElement.classList.remove('active');
        }
    }

    #previousPage(e) {
        alert('previous page clicked')
    }

    #handlePaginationClick(e) {
        alert('number clicked')
    }

    #onLoadEventHandler() {
        document.querySelector("#nextPage").addEventListener('click', (e) => {
            this.#nextPage(e);
        });

        document.querySelector("#previousPage").addEventListener('click', (e) => {
            this.#previousPage(e);
        });


        let paginationNumbers = document.getElementsByClassName("paginationNumber");
        for (let i = 0; i < paginationNumbers.length; i++) {
            paginationNumbers[i].addEventListener('click', (e) => {
                this.#handlePaginationClick(e);
            });
        }

    }

    #index(parent, child){//JQuery equivalent of index
        var nodes = Array.prototype.slice.call(parent.children ),
        liRef = child[0];
        return nodes.indexOf(liRef);
    }

    constructor(divToReplace, items, currentPage = 1, itemsPerPage = 20) {
        this.#divToReplace = divToReplace;
        this.#itemsPerPage = itemsPerPage;
        //this.#items = items.length;//the array of items that will be paginated
        this.#items = 200;
        this.#pages = Math.ceil(this.#items / this.#itemsPerPage);
        this.#createPaginationElement()

        window.onload = () => {
            this.#onLoadEventHandler();
        };
    }
}