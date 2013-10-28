$(document).ready(function () {

    //var currentContent = "";

    var cxBlog = "005646302152591029507:ndo3tbbopl0";
    //add new guides here when releasing a new version 
    var guideCxs = {
        "2.2":"005646302152591029507:mb6a9za1aoa", 
        "2.3":"005646302152591029507:zenlau0cpto", 
        "2.5":"005646302152591029507:akzqpmzyauq", 
        "2.6":"005646302152591029507:gsfwsaitfsa", 
        "2.7":"005646302152591029507:eywmbetvnfu"
    }    
    var cxEntireSite = "005646302152591029507:wp1h0fve318";

    
    var config = {
        apiURL:'https://www.googleapis.com/customsearch/v1',
        apiKey:'AIzaSyCR79snpFgr45ear_SBoqkjQaGa7FHYg4I', // Change this to your site
        cx: function() {
            href = window.location.href; 
            var re = /.*\/guide\/(\d+\.\d+)\/.*/;
            var regexArray = re.exec(href);
            if (regexArray && regexArray.length > 1) {
                return guideCxs[regexArray[1]];    
            }
            if (href.match(".*/blog.*") || href.match(".*/20.*") || href.match(".*/page.*") || href.match(".*/tags/.*")) 
                return cxBlog;
            return cxEntireSite;
        }(),
        perPage:10, // A maximum of 10 is allowed by Google
        page:0, // The start page
        pageTitle:"Search Results"
    }

    
    $('#go-search').click(function () {        
        googleSearch();
        return false;
    });

    function displaySearch(settings, data) {
        var resultsDiv = $('#content');
        var results = data.items;
        if (results) {         
            //handle back / forward event 
            //currentContent = resultsDiv.html();
            resultsDiv.text('');
            var paginationButtons = "<ul class=\"pager\">" +
                                    "<li rel=\"prev\" class=\"previous disabled\"><a href=\"#\">&larr; Previous</a></li>" +
                                    "<li rel=\"next\" class=\"next disabled\"><a href=\"#\">Next &rarr;</a></li></ul>"
            resultsDiv.append("<h1 style=\"margin-top: 0px;\">Search Results</h1>");
            resultsDiv.append(paginationButtons);
            
            // If results were returned, add them to a content div
            resultsDiv.append("<ul id=\"results-ul\" style=\"padding-left:0px;\"/>");
            var ul = $("#results-ul");
            for (var i = 0; i < results.length; i++) {
                ul.append(new result(results[i]) + '');
            }

            ul.hide().appendTo(resultsDiv).fadeIn('slow');            
            resultsDiv.append(paginationButtons);

            
            if (settings.page > 0) {                
                $("[rel='prev']").attr("class", "previous enabled");
                $("[rel='prev']").click(function () {
                    googleSearch({append:false, page:settings.page - 1});
                });
            } else {
                $("[rel='prev']").attr("class", "previous disabled");
                $("[rel='prev']").bind('click', false);
            }

            if (data.queries.request[0].totalResults > (settings.page + 1) * settings.perPage) {
                $("[rel='next']").attr("class", "next enabled");
                $("[rel='next']").click(function () {
                    googleSearch({append:false, page:settings.page + 1});
                });
            } else {
                $("[rel='next']").attr("class", "next disabled");
                $("[rel='next']").bind('click', false);
            }
        }
        else {
            // No results were found for this search.
            resultsDiv.empty();
            $('<p>', {html:"<h3 class=\"searchNoResult\">Oops, we couldn't find what you were looking for. Try rephrasing your search</h3>"}).hide().appendTo(resultsDiv).fadeIn();        
        }
    }

    function googleSearch(settings) {

        // If no parameters are supplied to the function,
        // it takes its defaults from the config object above:
        settings = $.extend({}, config, settings);
        settings.term = $('#q').val();
        
        //todo: tmp
        /*
        try {
            $.ajax({
                type:'GET',                
                url:'/sampleData.json',                
                success: function(data) {
                    displaySearch(settings, data);
                }, 
                error: function(e) {
                    console.log(e +"");
                }
            });
        }
        catch (e) {
            console.log(e + '');
        } 
        */       

        
        try {
            var pageNum = (settings.page * settings.perPage) + 1;
            $.ajax({
                type:'GET',
                url:settings.apiURL,
                dataType:'jsonp',
                data:{q:settings.term,
                    key:settings.apiKey,
                    num:settings.perPage,
                    start:((settings.page * settings.perPage) + 1),
                    cx:settings.cx,
                    alt:'json'},
                success: function(data) {
                    displaySearch(settings, data);
                    /* //history handling, disabled for now 
                    var origLocation = document.location;                     
                    history.pushState({"settings":settings, "data":data}, "Search results for " + settings.term, 
                                      origLocation + "#search?q=" + settings.term + pageNum);
                    
                    window.addEventListener("popstate", function(e) {
                        // URL location
                        var location = document.location;

                        // state
                        var state = e.state;
                        
                        // return to last state
                        if (state != null && location.href.indexOf("#search?") != -1) {
                            displaySearch(state["settings"], state["data"]);
                        } else if (location.href == origLocation.href) {
                            $('#content').html(currentContent);    
                        }
                        
                    });
                    */
                },
                error: function(e) {
                    console.log(e +"");
                }
            });
        }
        catch (e) {
            console.log(e + '');
        }
        


    }

    function result(r) {

        // This is class definition. Object of this class are created for
        // each result. The markup is generated by the .toString() method.

        /* results format: s
        <li class="search-result">
        <h4><a href="http://www.cloudifysource.org/guide/2.6/qsg/quick_start_guide_helloworld">Cloudify - Quick Start Guide</a></h4>
        <p>
            The goal of this quick start guide is to familiarize you with Cloudify in a few simple   steps. For this purpose, we will use a Hello World application Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod (an example&nbsp;...&nbsp;&nbsp;<a href="http://www.cloudifysource.org/guide/2.6/qsg/quick_start_guide_helloworld" target="_blank">Read More... »</a>
        </p>
        </li>
        */
        var arr = [
            '<li class="search-result">',
            '<h4><a href="',r.link,'">',r.title,'</a></h4>',
            '<p>',
            r.snippet,'&nbsp;&nbsp;',
            '<a href="',r.link, '">Read More &raquo;</a>',
            '</p>',            
            '</li>'
        ];


        // The toString method.
        this.toString = function () {
            return arr.join('');
        }
    }    


});