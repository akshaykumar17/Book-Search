import { LightningElement, track } from 'lwc';
import getBooks from '@salesforce/apex/SearchBook.getBooks';
export default class BookSearch extends LightningElement {

    @track columns = [
        {label: 'Book Name', fieldName: 'bookName', type: 'text'},
        {label: 'Author Name', fieldName: 'authorName', type: 'text'},
        {label: 'Availability', fieldName: 'availability', type: 'text'},
        {label: 'Edition No.', fieldName: 'edition', type: 'number'},
        {label: 'Author\'s work', fieldName: 'workURL', type: 'url', typeAttributes: { label: { fieldName: 'workURLName' }, value: { fieldName: 'workURL' }, target: '_self' } },
        {label: 'Link to book', fieldName: 'bookURL', type: 'url', typeAttributes: { label: { fieldName: 'bookURLName' }, value: { fieldName: 'bookURL' }, target: '_self' } },
        
    ];

    @track records = [];
    @track loadTable = false;
    @track loading = false;
    handleSearch(){
        this.loading = true;
        getBooks( { searchText :this.searchText} )
            .then( result => {
                var responsebody = result;
                var recodList = [];
                for(var i=0; i<responsebody.docs.length;i++){
                    var wrap = responsebody.docs[i];
                    var record = {authorName:'',bookName:'',bookURLName:'Link to Book',bookURL:'',id:'',language:''}
                    for(let author in wrap.author_name){
                       record.authorName+=wrap.author_name[author]+(author== wrap.author_name.length-1?'':' ; ');
                    }
                    record.bookName = wrap.title;
                    record.edition = wrap.editions.numFound;
                    record.availability = wrap.ebook_access;
                    record.workURLName = 'Link to Author\'s Work';
                    record.workURL = 'https://openlibrary.org'+wrap.key;
                    if(wrap.editions.docs!=undefined && wrap.editions.docs.length!=0){
                        record.bookURL= 'https://openlibrary.org'+wrap.editions.docs[0].key;
                        if(wrap.editions.docs[0].language!==undefined)record.language = wrap.editions.docs[0].language[0];
                    }
                    record.id=wrap.key;
                    recodList.push(record);                    
                }
                if(recodList.length>0){
                    this.loadTable = true;
                    this.records = recodList;
                }
                this.loading = false;
            })
            .catch( error => {
                this.loading = false;
                console.log(error);
            } );
    }
    get tableStyle() {
        return (this.searchable) ? 'table__border tableMargin' : 'table__height tableMargin';
    }
    nameChange(event) {
        if(event.target.name=='Search')
            this.searchText= event.target.value;
    }
}