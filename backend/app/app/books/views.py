from django.http import JsonResponse
from SPARQLWrapper import SPARQLWrapper, JSON
from datetime import datetime
import re
from string import punctuation
# import nltk 
# from nltk.tokenize import word_tokenize
# from nltk.stem import PorterStemmer
# nltk.download('punkt')
# from nltk.stem import WordNetLemmatizer
# nltk.download('wordnet')
# nltk.download('stopwords')
# from nltk.corpus import stopwords
# nltk.download('averaged_perceptron_tagger')
# from nltk.tag import pos_tag
# nltk.download('maxent_ne_chunker')
# nltk.download('words')
# from pattern.text.en import singularize
import spacy

def convert_to_date(date):
    timestamp = int(date)  # Assuming this is a timestamp in seconds
    dt_object = datetime.utcfromtimestamp(timestamp*30000)
    xsd_date_time = dt_object.strftime('%d-%m-%Y')
    return xsd_date_time

def get_home(request):
    return JsonResponse({"message": "Welcome to the Books API!"})

def get_books(request):
    # SPARQL query to retrieve restaurants' TableCapacity and TableID
    sparql_query = """
        PREFIX book: <http://purl.org/NET/book/vocab#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>

        SELECT ?book ?id ?title ?author ?coverImageURL ?averageRating ?description ?tags ?belongsToGenre ?publisher ?publicationDate
        WHERE {
        ?book a ont:Book.
        ?book ont:id ?id.
        ?book ont:title ?title.
        ?book ont:authors ?author.
        ?book ont:coverImageURL ?coverImageURL.
        ?book ont:averageRating ?averageRating.
        OPTIONAL {
            ?book ont:tags ?tags.
            ?book ont:description ?description.
            ?book ont:belongsToGenre ?belongsToGenre.
            ?book ont:publisher ?publisher.
            ?book ont:publicationDate ?publicationDate.
     	 }
        }
        LIMIT 10
    """

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper(
        "http://localhost:3030/books-ontology/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    books_data = []
    for result in results["results"]["bindings"]:
        book = {
            "id": result["id"]["value"],
            "title": result["title"]["value"],
            "author": result["author"]["value"],
            "coverImageURL": result["coverImageURL"]["value"],
            "averageRating": result["averageRating"]["value"],
            "description": result["description"]["value"] if "description" in result else None,
            "tags": result["tags"]["value"] if "tags" in result else None,
            "publisher": result["publisher"]["value"] if "publisher" in result else None,
            "publicationDate": result["publicationDate"]["value"] if "publicationDate" in result else None,
        }
        books_data.append(book)

    unique_books = {}

    for book in books_data:
        unique_books[book['id']] = book

    unique_books_list = list(unique_books.values())

    return JsonResponse(unique_books_list, safe=False)

def get_book_details(request, book_id):
    sparql_query = """
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>
        SELECT ?id ?book ?title ?author ?coverImageURL ?averageRating ?description ?tags ?belongsToGenre ?publisher ?publicationDate
        WHERE {
            ?book a ont:Book.
            ?book ont:id ?id.
            FILTER (?id = %s)
            ?book ont:title ?title.
            ?book ont:authors ?author.
            ?book ont:coverImageURL ?coverImageURL.
            ?book ont:averageRating ?averageRating.
            OPTIONAL {
                ?book ont:tags ?tags.
                ?book ont:description ?description.
                ?book ont:belongsToGenre ?belongsToGenre.
                ?book ont:publisher ?publisher.
                ?book ont:publicationDate ?publicationDate.
            }
        }
    """ % book_id

    sparql = SPARQLWrapper("http://localhost:3030/books-ontology/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    try:
        results = sparql.query().convert()
        books_data = []
        for result in results["results"]["bindings"]:
            book = {
                "id": result["id"]["value"],
                "title": result["title"]["value"],
                "author": result["author"]["value"],
                "coverImageURL": result["coverImageURL"]["value"],
                "averageRating": result["averageRating"]["value"],
                "description": result["description"]["value"] if "description" in result else None,
                "tags": result["tags"]["value"] if "tags" in result else None,
                "publisher": result["publisher"]["value"] if "publisher" in result else None,
                "publicationDate": convert_to_date(result["publicationDate"]["value"]) if "publicationDate" in result else None,
            }
            books_data.append(book)
        
        unique_books = {}
        for book in books_data:
            unique_books[book['id']] = book

        unique_books_list = list(unique_books.values())

        return JsonResponse(unique_books_list, safe=False)

    except Exception as e:
        # Handle exceptions appropriately, like logging or returning an error response
        return JsonResponse({"error": str(e)})

def get_quotes(request):
    # SPARQL query to retrieve restaurants' TableCapacity and TableID
    sparql_query = """
        PREFIX book: <http://purl.org/NET/book/vocab#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>

        SELECT ?quote ?author ?description
        WHERE {
            ?quote a ont:Quote.
            ?quote ont:authors ?author.
            ?quote ont:description ?description.
        }
        LIMIT 3
    """

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper(
        "http://localhost:3030/books-ontology/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    quotes_data = []
    for result in results["results"]["bindings"]:
        book = {
            "author": result["author"]["value"],
            "description": result["description"]["value"] if "description" in result else None,
        }
        quotes_data.append(book)



    return JsonResponse(quotes_data, safe=False)

def get_books_by_search(request):
    search_query = request.GET.get('search', '')  # Get search query from request parameters
    search_query = search_query.lower()

    # SPARQL query to retrieve video games' id, title, releaseDate, averageUserRating, assets, and hasImage
    sparql_query = """
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>

        SELECT ?book ?id ?title ?description ?averageRating ?author ?coverImageURL ?tags ?belongsToGenre ?publisher ?publicationDate
        WHERE {
            ?book a ont:Book.
            ?book ont:id ?id.
            ?book ont:title ?title.
            ?book ont:authors ?author.
            ?book ont:coverImageURL ?coverImageURL.
            ?book ont:averageRating ?averageRating.
        OPTIONAL {  
            ?book ont:tags ?tags.
            ?book ont:description ?description.
            ?book ont:belongsToGenre ?belongsToGenre.
            ?book ont:publisher ?publisher.
            ?book ont:publicationDate ?publicationDate. 
            }
        FILTER (REGEX(?title, "%s", "i") || REGEX(?description, "%s", "i") || REGEX(?author, "%s", "i"))
        }
    """ % (search_query, search_query, search_query)  # Inject search query into SPARQL FILTER

     # Query RDF data using SPARQL
    sparql = SPARQLWrapper(
        "http://localhost:3030/books-ontology/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    books_data = []
    for result in results["results"]["bindings"]:
        book = {
            "id": result["id"]["value"],
            "title": result["title"]["value"],
            "author": result["author"]["value"],
            "coverImageURL": result["coverImageURL"]["value"],
            "averageRating": result["averageRating"]["value"],
            "description": result["description"]["value"] if "description" in result else None,
            "tags": result["tags"]["value"] if "tags" in result else None,
            "publisher": result["publisher"]["value"] if "publisher" in result else None,
            "publicationDate": result["publicationDate"]["value"] if "publicationDate" in result else None,
        }
        books_data.append(book)

    unique_books = {}

    for book in books_data:
        unique_books[book['id']] = book

    unique_books_list = list(unique_books.values())

    return JsonResponse(unique_books_list, safe=False)

def get_genres(request):
    sparql_query = """
        PREFIX book: <http://purl.org/NET/book/vocab#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>

        SELECT ?genre
        WHERE {
            ?genre a ont:Genre.
        }
    """

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper(
        "http://localhost:3030/books-ontology/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    genres_data = []
    for result in results["results"]["bindings"]:
        genre = {
            "genre": result["genre"]["value"],
        }
        genres_data.append(genre)

    return JsonResponse(genres_data, safe=False)

def get_books_by_genre(request):
    genre = request.GET.get('genre', '')  # Get search query from request parameters

    # SPARQL query to retrieve video games' id, title, releaseDate, averageUserRating, assets, and hasImage
    sparql_query = f"""
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?book ?id ?title ?description ?averageRating ?author ?coverImageURL ?tags ?belongsToGenre ?publisher ?publicationDate
        WHERE {{
  			?book rdf:type ont:Book .
            ?book ont:title ?title .
            ?book ont:authors ?author .
            ?book ont:id ?id.
            ?book ont:coverImageURL ?coverImageURL.
            ?book ont:averageRating ?averageRating.
            ?book ont:belongsToGenre ont:{genre}.
        OPTIONAL {{  
            ?book ont:tags ?tags.
            ?book ont:description ?description.
            ?book ont:belongsToGenre ?belongsToGenre.
            ?book ont:publisher ?publisher.
            ?book ont:publicationDate ?publicationDate. 
            }}
        }}
    """

    # print(sparql_query)
     # Query RDF data using SPARQL
    sparql = SPARQLWrapper(
        "http://localhost:3030/books-ontology/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    books_data = []
    for result in results["results"]["bindings"]:
        book = {
            "id": result["id"]["value"],
            "title": result["title"]["value"],
            "author": result["author"]["value"],
            "coverImageURL": result["coverImageURL"]["value"],
            "averageRating": result["averageRating"]["value"],
            "description": result["description"]["value"] if "description" in result else None,
            "tags": result["tags"]["value"] if "tags" in result else None,
            "publisher": result["publisher"]["value"] if "publisher" in result else None,
            "publicationDate": result["publicationDate"]["value"] if "publicationDate" in result else None,
        }
        books_data.append(book)

    unique_books = {}

    for book in books_data:
        unique_books[book['id']] = book
    
    unique_books_list = list(unique_books.values())

    return JsonResponse(unique_books_list, safe=False)

def get_books_with_NLP(request):
    # text = "all of the books written by jk rowling"
    # processed_text =  re.sub(f"[{re.escape(punctuation)}]", "", text)
    # processed_text = " ".join(processed_text.split())
    # print(processed_text)

    # tokens = word_tokenize(processed_text)
    # ps = PorterStemmer()
    # required_words = [ps.stem(x) for x in tokens ]

    # sentence_with_stemmed_words = ' '.join(required_words)
    # print(sentence_with_stemmed_words)

    # wordnet_lemmatizer = WordNetLemmatizer()
    # tokens = word_tokenize(processed_text)
    # required_words = [wordnet_lemmatizer.lemmatize(x, 'v') for x in  tokens]
    # sentence_with_lemmnatized_word = " ".join(required_words)
        
    # print(sentence_with_lemmnatized_word)

    # stop_words = set(stopwords.words('english'))
    # # print(stop_words)

    # # This code helps remove stop words
    # tokens = word_tokenize(sentence_with_lemmnatized_word)
    # filtered_words = [x for x in tokens if x not in stop_words]
    # sentence_without_stop_words = " ".join(filtered_words)
    
    # print(sentence_without_stop_words)
    # def create_pos_tags(sent):
    #     sent = nltk.word_tokenize(sent)
    #     sent = nltk.pos_tag(sent)
    #     return sent

    # tags = create_pos_tags(sentence_without_stop_words)
    # print(tags)

    # # We will use NLTK NER classifier to identify named entities 
    # named_entities = nltk.ne_chunk(tags) 
    # # named_entities.draw()
    # individuals = []
    # classes =[]
    # properties = []

    # # Iterate over the named entities and print their labels 
    # for entity in named_entities: 
    #     if hasattr(entity, "label"): 
    #         print(entity.label())
    #         individual = ' '.join(c[0] for c in entity)
    #         print(individual)
    #         individuals.append(individual)
    #     else:
    #         print(entity)
    #         if entity[1]=="NN" or entity[1]=="NNS " or entity[1]=="NNP" or entity[1]=="NNPS":
    #             classes.append(singularize(entity[0]).capitalize())
    #         elif entity[1]=="WP":
    #             properties.append(entity[0])
    #         elif entity[1]=="VB" or entity[1]=="VBD" or entity[1]=="VBG" or entity[1]=="VBN" or entity[1]=="VBP" or entity[1]=="VBZ":
    #             individuals.append(entity[0])
    
    # print(classes)
    # print(properties)
    # print(individuals)

    # sparql = SPARQLWrapper("http://localhost:3030/books-ontology/query")
    # class_triple = "?x a book:" + classes[0] + "."
    # property_triple = "\n OPTIONAL {?x book:" + properties[0] + " ?y.}"
    # individual_triple = "{?x (book:| !book:)* ?y}{?y book:title ?title} FILTER(?title=" + "'" + individuals[0] + "'" + ")"
    # query_start = """
    #     PREFIX book: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>
    #     SELECT ?x WHERE {
    #     """
    # query_end = "}"
    # query = query_start + class_triple + property_triple + individual_triple + query_end
    # print(query)
    # sparql.setQuery(query)
    # sparql.setReturnFormat(JSON)
    # results = sparql.query().convert()
    # # print(results)
    # print(results["results"]["bindings"])

    # books = []

    # for result in results["results"]["bindings"]:
    #     book = {
    #         "book": result["x"]["value"],
    #     }
    #     books.append(book)

    # return JsonResponse(books, safe=False)


    text_query = request.GET.get('text','')
    processed_text =  re.sub(f"[{re.escape(punctuation)}]", "", text_query)
    stop_words = ["book", "author", "genre", "publisher", "publication date", "to", "read", "a", "about", "books", "authors", "genres", "publishers", "publication dates", "written", "by", "published", "in", "on", "at", "the", "of", "from", "to", "for", "with", "about", "between", "and", "or", "not", "is", "are", "was", "were", "has", "have", "had", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "a", "an", "the", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "his", "hers", "ours", "theirs", "what", "which", "who", "whom", "whose", "where", "when", "why", "how", "all", "any", "both", "each", "few", "many", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "can", "will", "just", "don", "should", "now"]

    if processed_text == "":
        return JsonResponse({"message": "Please give me book name or author name. And also I can recommend books for you by genre and by publication date. Thanks.)"}, status=200)

    # Load the spaCy model
    nlp = spacy.load("en_core_web_sm")

    # Sample text (you can replace this with your own text)
    # text = "Can you recommend a book belongs to genre Computers?"

    # Process the text with spaCy
    doc = nlp(processed_text)
    # print(doc.ents[0].label_)
    
   
    # Extract relevant entities (e.g., author names, book titles)
    author = ""
    title = ""
    publicationDate = ""
    genre=""
    for entity in doc.ents:
        if entity.label_ == "PERSON":
            author = entity.text
        elif entity.label_ == "WORK_OF_ART":
            title = entity.text
        elif entity.label_ == "DATE":
            publicationDate = entity.text

    if "about" in processed_text:
        for token in doc:
            if (token.pos_ == "NOUN" or token.pos_ == "ADJ")  and token.text != "genre" and token.text != "book" and token.text != "books" and token.text != "genres" :
                genre += token.text
    
    if "genre" in processed_text:
        for token in doc:
            if (token.pos_ == "NOUN" and token.pos_ == "ADJ")   and token.text != "genre" and token.text != "book" and token.text != "books" and token.text != "genres" :
                genre += token.text

    print(doc.ents)

    # Construct a SPARQL query
    query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.semanticweb.org/mac/ontologies/2023/10/books-ontology#>
        SELECT ?title ?author ?publicationDate ?tags ?id ?coverImageURL ?averageRating ?description ?belongsToGenre ?publisher
        WHERE {
            ?book rdf:type ont:Book.
            ?book ont:id ?id.
            ?book ont:title ?title.
            ?book ont:authors ?author.
            ?book ont:coverImageURL ?coverImageURL.
            ?book ont:averageRating ?averageRating.
            ?book ont:tags ?tags.
            ?book ont:publicationDate ?publicationDate. 

        OPTIONAL {  
            ?book ont:description ?description.
            ?book ont:belongsToGenre ?belongsToGenre.
            ?book ont:publisher ?publisher.
        }   
            FILTER (REGEX(?title, "%s", "i"))
            FILTER(REGEX(?author, "%s", "i"))
            FILTER(REGEX(?publicationDate, "%s", "i"))
            FILTER(REGEX(?tags, "%s", "i"))
        }
    """ % (title, author, publicationDate, genre)

    # Replace the SPARQL endpoint URL with your own endpoint
    sparql_endpoint = "http://localhost:3030/books-ontology/query"

    # Create a SPARQLWrapper object and set the query
    sparql = SPARQLWrapper(sparql_endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)

    books_data = []
    # Execute the query and print the results
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        book = {
            "id": result["id"]["value"],
            "coverImageURL": result["coverImageURL"]["value"],
            "averageRating": result["averageRating"]["value"],
            "description": result["description"]["value"] if "description" in result else "",
            "belongsToGenre": result["belongsToGenre"]["value"] if "belongsToGenre" in result else "",
            "publisher": result["publisher"]["value"] if "publisher" in result else "",
            "tags": result["tags"]["value"],
            "title": result["title"]["value"],
            "author": result["author"]["value"],
            "publicationDate": result["publicationDate"]["value"],
        }
        books_data.append(book)
    
    if len(doc.ents) == 0:
        return JsonResponse({"message": "Hello, I am fresher NLP model. Please make sentences clearly. Give me book names or authors. Also I can recommend books for you by genre and bu publication date. Thanks.:)" , "question":text_query, "books":[]},  safe=False)    
    
    unique_books = {}

    for book in books_data:
        unique_books[book['id']] = book

    unique_books_list = list(unique_books.values())

    if len(unique_books_list) == 0:
        return JsonResponse([{"message": "No books found","genre": genre, "author" : author, "title" : title, "question":text_query}],  safe=False)    
        
    return JsonResponse({"books":unique_books_list, "question":text_query, "author":author,"title":title, "genre":genre, "publicationDate":publicationDate}, safe=False)