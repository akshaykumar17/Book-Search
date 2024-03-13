public class SearchBook {
    @AuraEnabled(cacheable=true)
    public static InitialResponseWrap getBooks(String searchText){

        searchText = searchText.replace(' ', '+');
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://openlibrary.org/search.json?q=(ebook_access%3Aborrowable+OR+ebook_access%3Apublic)&title='+searchText+'&fields=key,title,author_name,ebook_access,editions,editions.key,editions.title,editions.ebook_access,editions.language');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        InitialResponseWrap result = new InitialResponseWrap();
        if (response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            result = (InitialResponseWrap) JSON.deserialize(response.getBody(),InitialResponseWrap.class);
            System.debug('>>>>>'+response.getBody());
            System.debug('>>>>>'+result);
            
        }
        return result;
    }

    public class InitialResponseWrap{
        @AuraEnabled public Integer numFound;
        @AuraEnabled public Integer start;
        @AuraEnabled public Boolean numFoundExact;
        @AuraEnabled public list<DocsWrap> docs; 
    }
    public class DocsWrap{
        @AuraEnabled public list<String> author_name;
        @AuraEnabled public String ebook_access;
        @AuraEnabled public String key;
        @AuraEnabled public String title;
        @AuraEnabled public InnerEditionWrap editions;
    }
    public class InnerEditionWrap{
        @AuraEnabled public Integer numFound;
        @AuraEnabled public Integer start;
        @AuraEnabled public Boolean numFoundExact;
        @AuraEnabled public list<InnerDocWrap> docs;
    }
    public class InnerDocWrap{
        @AuraEnabled public String key;
        @AuraEnabled public String title;
        @AuraEnabled public list<String> language;
        @AuraEnabled public String ebook_access;
    }
}