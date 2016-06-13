
	/*!
 * v 0.3
 * mallmaverick.js - 
 * MobileFringe copywrite 2014
 */
 
var mallData = null;

$(document).ready(function() {
  $.ajaxSetup({ cache: false });
}); 


function setEndPoint(url){
    sessionStorage.setItem('MM_URL', url);
}

function setSocialEndPoint(url){
    sessionStorage.setItem('MM_SOCIAL_FEED_URL', url);
}


function get_prefix(){
    var main_url = (sessionStorage.MM_URL).split('/');
    var page_prefix = main_url[0]+'//'+main_url[2]
    return page_prefix;
}

function log(str){
    if(typeof(console)!='undefined'){
        console.log(str);
    }
}

function loadMallData(callback){
    if (mallData != null){
        log("hey I have some mall data already!");
        log(JSON.stringify(JSON.stringify(data)));
    }
    if(true){//typeof(sessionStorage.mallData) == 'undefined'){
        log('fetching mallData from: '+sessionStorage.MM_URL);
        $.getJSON(sessionStorage.MM_URL).done(function(data) {
            mallData = data;
            sessionStorage.setItem('mallData', JSON.stringify(data));
            log('done fetching mallData from: '+sessionStorage.MM_URL);
            callback();
        });
    }else{
       callback();
       log('mallData Already loaded');
    }
    
}

function loadMallDataCached(callback){
    if (mallData != null){
        log("hey I have some mall data already!");
        log(JSON.stringify(JSON.stringify(data)));
    }
    if(typeof(sessionStorage.mallData) == 'undefined'){
        log('fetching mallData from: '+sessionStorage.MM_URL);
        $.getJSON(sessionStorage.MM_URL).done(function(data) {
            mallData = data;
            sessionStorage.setItem('mallData', JSON.stringify(data));
            log('done fetching mallData from: '+sessionStorage.MM_URL);
            callback();
        });
    }else{
       callback();
       log('mallData Already loaded');
    }
    
}

function get_instagram(url,total, callback){
    var html = '<a class="ig-image" target="_blank" href="{{{link}}}" ><img src="{{{image}}}" alt="{{caption}}" /></a>'
    var item_rendered = [];
    Mustache.parse(html); 
    log('fetching instagram data from: ' + url);
    $.getJSON(url).done(function(data) {
        var insta_feed = data.social.instagram
        $.each(insta_feed, function(i,v){
            var feed_obj = {}
            if(v.caption != null){
                feed_obj.caption = v.caption.text
            }
            else{
                feed_obj.caption = ""
            }
            feed_obj.image = v.images.low_resolution.url
            feed_obj.link = v.link
            if (i < total){
                
                var ig_rendered =  Mustache.render(html,feed_obj);
                console.log(ig_rendered)
                item_rendered.push(ig_rendered.trim());
            }
        })
        callback(item_rendered)
    });
}


function loadSocialFeeds(callback){
    log('fetching mallData from: '+sessionStorage.MM_SOCIAL_FEED_URL);
    $.getJSON(sessionStorage.MM_SOCIAL_FEED_URL).done(function(data) {
        mallSocialData = data;
        sessionStorage.setItem('mallSocialData', JSON.stringify(data));
        log('done fetching  mallSocialData from: '+ sessionStorage.MM_SOCIAL_FEED_URL);
            callback();
    });
}

//Call a function after matching images have finished loading
function imagesLoadedEvent(selector, callback) {
    var This = this;
    this.images = $(selector);
    this.nrImagesToLoad = this.images.length;
    this.nrImagesLoaded = 0;

    //check if images have already been cached and loaded
    $.each(this.images, function (key, img) {
        if (img.complete) {
            This.nrImagesLoaded++;
        }
        if (This.nrImagesToLoad == This.nrImagesLoaded) {
            callback(This.images);
        }
    });

    this.images.load(function (evt) {
        This.nrImagesLoaded++;
        if (This.nrImagesToLoad == This.nrImagesLoaded) {
            callback(This.images);
        }
    });
}



function isMallDataLoaded(){
    if(sessionStorage.mallData && typeof(sessionStorage.mallData) != 'undefined'){
        return true;
    }
    return false;
    
}

function getRequestParam(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function localizeObject(mm_object){

    if(sessionStorage.current_locale == sessionStorage.secondary_locale){
        if(mm_object !== null && typeof(mm_object) != 'undefined'){
            if(mm_object.name_2 !== null && typeof(mm_object.name_2) != 'undefined' && mm_object.name_2.length > 0){
                mm_object.name = mm_object.name_2;
                
            }
            if(mm_object.description_2 !== null && typeof(mm_object.description_2) != 'undefined' && mm_object.description_2.length > 0){
                mm_object.description = mm_object.description_2;
            }
            
            if(mm_object.rich_description_2 !== null && typeof(mm_object.rich_description_2) != 'undefined' && mm_object.rich_description_2.length > 0){
                mm_object.rich_description = mm_object.rich_description_2;
            }
            
            if(mm_object.event_image2_url_abs !== null && typeof(mm_object.event_image2_url_abs) != 'undefined' && mm_object.event_image2_url_abs.length > 0){
                mm_object.event_image_url_abs = mm_object.event_image2_url_abs;
            }
             
            if(mm_object.promo_image2_url_abs !== null && typeof(mm_object.promo_image2_url_abs) != 'undefined' && mm_object.promo_image2_url_abs.length > 0){
                mm_object.promo_image_url_abs = mm_object.promo_image2_url_abs;
            }
            if(mm_object.holiday_name_2 !== null && typeof(mm_object.holiday_name_2) != 'undefined' && mm_object.holiday_name_2.length > 0){
                mm_object.holiday_name = mm_object.holiday_name_2;
            }
            if(mm_object.job_type == "Part Time"){
                mm_object.job_type = "Temps partiel";                
            }
            if(mm_object.job_type == "Part Time/Full Time"){
                 mm_object.job_type = "Temps partiel/Temps Plein"; 
            }if(mm_object.job_type == "Full Time"){
                 mm_object.job_type = "Temps Plein"; 
            }if(mm_object.job_type == "Seasonal"){
                 mm_object.job_type = "Saisonnier"; 
            }
        }
        
        
    }
} 

function getSVGMapURL(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return 'http://cdn.mallmaverick.com' + mallDataJSON.property.svgmap_url;
}

function getPNGMapURL(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return 'http://cdn.mallmaverick.com' + mallDataJSON.property.map_url;
}

function getStoresList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.stores;
}

function getNewStoresList(){
    var new_stores = [];
    var stores = getStoresList();
    $.each(stores, function(i, store){
        if (store.is_new_store == true){
            new_stores.push(store);
        }
    });
    return new_stores;
}

function getComingSoonList(){
    var new_stores = [];
    var stores = getStoresList();
    $.each(stores, function(i, store){
        if (store.is_coming_soon_store == true){
            new_stores.push(store);
        }
    });
    return new_stores;
}

function getBanners(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.banners;
}


function getMobileBanners(){
    return getRepoDetailsByName('mobile-homepage');
    
}

function getFashions(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.fashions;
}


function getFashionBySlug(slug){
    var fashions =  getFashions();
    return getObjects(fashions,'slug',slug)[0];
}

function getPopups(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.popups;
}


function get_meta(path){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    meta = []
    metas = mallDataJSON.meta_data;
    for ( i = 0; i < metas.length; i++){
        var pathArray = metas[i].path.split( '/' );
        var slug = pathArray[pathArray.length-1];
        if (slug == path ){
            meta = metas[i];
        }
    }
     $('title').html(meta.meta_title);
     $("head").append('<meta name="description" content="'+meta.meta_description+'">');
     $("head").append('<meta name="keywords" content="'+meta.meta_keywords+'">');
}  

function getCategoriesNamesByStoreSlug(slug){
    var categories_names = ""
    var store = getStoreDetailsBySlug(slug)
    var categories = store.categories
    var cat_length =  categories.length
    $.each(categories, function(i, val){
        var c = getCategoryDetails(val)
        if (i == 0){
            categories_names = c.name
        }
        else{
            if(i < cat_length-1){
                categories_names = categories_names + ", " + c.name
            }
            else{
                categories_names = categories_names + " and " + c.name
            }
        }
    })
    return categories_names;
}

function getStoresListByCategoryID(category_id){
    var return_list=[];
    var category_stores = getStoresListByCategory();
    $.each(category_stores, function(i, val){
        if ($.inArray(category_id, val.categories) > -1){
            if ( $.inArray(category_stores[i], return_list) == -1 ){
                return_list.push(category_stores[i]);
            }
        }
    });
    return return_list;
}

function getStoresListByCategory(){
    var category_stores = [];
    var all_stores = getStoresList();
    var all_categories = getStoreCategories();
    for (i = 0; i < all_categories.length; i++) {
        for (j = 0; j < all_stores.length; j++) {
            if($.inArray(parseInt(all_categories[i].id), all_stores[j].categories) > -1){
                category_stores.push(all_stores[j]);
            }
        }
    }
    
    return category_stores;
}

function showOnWeb(eventObj){
    var showDate = eventObj.show_on_web_date;
    var dateParts = showDate.split("-");
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd='0'+dd
    } 
    
    if(mm<10) {
        mm='0'+mm
    } 
    
    today = yyyy+'-'+ mm +'-'+ dd;
    if (today >= showDate){
       return true;
    } else {
        return false;
    }
}

function getImageURL(existing_url){
    if(!existing_url ||  existing_url.indexOf('missing.png') > -1 || existing_url.length === 0){
        //http://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        
    }
    return "http://cdn.mallmaverick.com"+existing_url;
}

function getImageURLStaging(existing_url){
    if(!existing_url ||  existing_url.indexOf('missing.png') > -1 || existing_url.length === 0){
        //http://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        
    }
    return "http://cdn.mallmaverickstaging.com"+existing_url;
}

function getAbsoluteImageURL(existing_url){
    if(!existing_url ||  existing_url.indexOf('missing.png') > -1 || existing_url.length === 0){
        //http://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        
    }
    return existing_url;
}

function hasImage(image_url){
    if(!image_url ||  image_url.indexOf('missing.png') > -1 || image_url.length === 0){
        return false;
    }
    return true;
}

function getBlogByName(folderName){
    
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    var folder = [];
  
    $.each( mallDataJSON.blogs, function( index,  value) {
        if(value.name == folderName){
            folder.push(value);
        }
    });
    return folder[0].posts;
}

function getBlogList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.blogs;
}

function getBlogDataBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    var blog =  getObjects(mallDataJSON.blogs,'slug',slug)[0];
    var posts = [];
    if(blog.posts.length > 0){
        $.each(blog.posts, function(key, val){
           var publish_date = new Date(val.publish_date);
           var today = new Date();
           if (publish_date <= today){
               posts.push(val);
           }
        });
        blog.posts = posts;
    }
    return blog;
}

function getAllPublishedPosts(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    var blogs = mallDataJSON.blogs;
    var posts = [];
    $.each(blogs, function(key, val){
        var p = val.posts;
        $.each(p, function(i, v){
            var publish_date = new Date(v.publish_date);
            var today = new Date();
            if (publish_date <= today){
                posts.push(v); 
            }
        });
    });
    return posts;
    
}

function getPrevPublishedPostBySlug(slug){
    var post = getPublishedPostDetailsBySlug(slug)[0];
    var posts = getAllPublishedPosts().sortBy(function(o){ return o.publish_date }).reverse();
    var num = 0;
    $.each(posts, function(i, val){
        if (val.id == post.id){
          num = i;
        }
    });
    return posts[num-1];
}

function getNextPublishedPostBySlug(slug){
    var post = getPublishedPostDetailsBySlug(slug)[0];
    var posts = getAllPublishedPosts().sortBy(function(o){ return o.publish_date }).reverse();
    var num = 0;
    $.each(posts, function(i, val){
        if (val.id == post.id){
          num = i;
        }
    });
    return posts[num+1];
}



function getBlogDetailByName(slug, folderName){
    var posts =  getBlogByName(folderName);
    return getObjects(posts,'slug',slug);
}

function getPostList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.blogs[0].posts;
}
function getPostDetailsBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.blogs[0].posts,'slug',slug)[0];
}

function getPublishedPostDetailsBySlug(slug){
    var posts = getAllPublishedPosts();
     return getObjects(posts,'slug',slug);
}

function getPostsByTag(tag){
    var allPosts = getPostList();
    var posts = [];

    $.each( allPosts, function( index, value ) {
        $.each( value.tag, function( index2, value2 ) {
            if(value2 == tag){
                posts.push(value);
                return false;
            }
        });
    });
    return posts;
}
// BLOG SEARCH BASE ON TITLE,CONTENT,TAG
function getPostsByKeyword(keyword){
    var allPosts = getPostList();
    var posts = [];

    $.each( allPosts, function( index, value ) {
        if(value.title.toLowerCase().indexOf(keyword) >= 0 
        | value.body.toLowerCase().indexOf(keyword) >= 0){
            posts.push(value);
        }else{
            $.each( value.tag, function( index2, value2 ) {
                if(value2.toLowerCase().indexOf(keyword) >= 0){
                    posts.push(value);
                    return false;
                }
            });
        }
    });
    return posts;
}
function getPrevPostBySlug(slug){
    var posts = getPostList();
    posts.sort(function(a, b){
        if(a.publish_date > b.publish_date) return -1;
        if(a.publish_date < b.publish_date) return 1;
        return 0;
    });
    var prevPost;
    $.each( posts, function( index, value ) {
        if (value.slug == slug) {
            return false;
        }else{
            prevPost = value;
        };
    });
    return prevPost;
}
function getNextPostBySlug(slug){
    var posts = getPostList();
    posts.sort(function(b, a){
        if(a.publish_date > b.publish_date) return -1;
        if(a.publish_date < b.publish_date) return 1;
        return 0;
    });
    var nextPost;
    $.each( posts, function( index, value ) {
        if (value.slug == slug) {
            return false;
        }else{
            nextPost = value;
        }
    });
    return nextPost;
}


function getPromotionsList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.promotions;
}

function getSocialFeed(){
    var mallSocialData = JSON.parse(sessionStorage.mallSocialData);
    return mallSocialData.social;
}


function getContestList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.contests;
}


function getContestBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.contests,'slug',slug)[0];
}


function getPromotionDetailsBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.promotions,'slug',slug)[0];
}

function getEventDetailsBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.events,'slug',slug)[0];
}

function getRepoList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.repos;
}

function getRepoDetailsByName(name){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.repos,'name',name)[0];
}
function getAssetBySlug(slug){
    var list = getRepoList();
    var asset;
    $.each( list, function( index, repo ) {
        $.each( repo.images, function( index, item ) {
            if (item.slug == slug) {
                asset = item;
                return false;
            };
        });
    });
    return asset;
}

function getFeatureList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.feature_items;
}


function getMallMaverickImgUrl(url){
    var MallMaverickUrl = "http://cdn.mallmaverick.com" + url;
    return MallMaverickUrl;
}



function getPromotionsListByStoreName(){
    var promotions = getPromotionsList();
    $.each( promotions , function( key, val ) {
        if(val.promotionable_type == 'Store'){
            var store_details = getStoreDetailsByID(val.promotionable_id);
            if (store_details){
                val.store_name = store_details.name;
                val.store = store_details;
            }
        }else{
            val.store_name = "a";
        }
    });
    return promotions.sort(sortByStoreName);
}

function getStorePromotionsListByStoreName(){
    var promotions = getPromotionsList();
    $.each( promotions , function( key, val ) {
        if(val.promotionable_type == 'Store'){
            var store_details = getStoreDetailsByID(val.promotionable_id);
            if (store_details){
                val.store_name = store_details.name;
                val.store = store_details;
            }
        }else{
            val.store_name = "a";
        }
    });
    return promotions.sort(sortByStoreName);
}

function getPropertyPromotionsListByStoreName(){
    var promotions = getPromotionsList();
    $.each( promotions , function( key, val ) {
        if(val.promotionable_type == 'Store'){
            var store_details = getStoreDetailsByID(val.promotionable_id);
            if (store_details){
                val.store_name = store_details.name
                val.store = store_details;
            }
        }else{
            val.store_name = "a";
        }
    });
    return promotions.sort(sortByStoreName);
}

function getPromotionsListByStoreName(){
    var promotions = getPromotionsList();
    $.each( promotions , function( key, val ) {
        if(val.promotionable_type == 'Store'){
            var store_details = getStoreDetailsByID(val.promotionable_id);
            if (store_details){
                val.store_name = store_details.name
            }
        }else{
            val.store_name = "a";
        }
    });
    return promotions.sort(sortByStoreName);
}


function sortByStoreName(a, b){
  var aName = "a";
  if(typeof(a.store_name) != 'undefined'){
      aName = a.store_name.toLowerCase();
  }
  var bName = "b";
  if(typeof(b.store_name) != 'undefined'){
      aName = b.store_name.toLowerCase();
  }
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function getJobsList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.jobs;
}


function getJobDetailsBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.jobs,'slug',slug)[0];
}

function getEventsList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.events;
}

function getPropertyEventsList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    var events = mallDataJSON.events;
    var property_events = []
    $.each(events, function(index, value){
        if(value.eventable_type == "Property"){
            property_events.push(value);
        }
    })
    return property_events;
}

function getStoreEventsList(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    var events = mallDataJSON.events;
    var store_events = []
    $.each(events, function(index, value){
        if(value.eventable_type == "Store"){
            store_events.push(value);
        }
    })
    return store_events;
}

function getStoreDetailsBySlug(slug){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.stores,'slug',slug)[0];
}

function getStoreDetailsByID(store_id){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.stores,'id',store_id)[0];
}

function getStoreDetailArrayByIDs(collection){
    store_array = []
    $.each( collection , function( key, val ) {
        store_array.push(getStoreDetailsByID(val))
    })
    
    return store_array
}

function getStoreCategories(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.categories;
}

function getPropertyDetails(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return mallDataJSON.property;
}

function getCategoryDetails(category_id){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return getObjects(mallDataJSON.categories,'id',category_id)[0];
}


function getPromotionsForIds(promo_ids){
    var promos=[];
    var all_promos = getStorePromotionsListByStoreName()
    for (i = 0; i < all_promos.length; i++) {
        for (j = 0; j < promo_ids.length; j++) { 
            if(promo_ids[j] == all_promos[i].id){
                promos.push(all_promos[i]);
                
            }
        }
    }
    return promos;
}

function getPublishedPromotionsForIds(promo_ids){
    var promos=[];
    var all_promos = getPromotionsList();
    for (i = 0; i < all_promos.length; i++) {
        for (j = 0; j < promo_ids.length; j++) { 
            var today = new Date();
            var p_date = new Date(all_promos[i].show_on_web_date);
            if(promo_ids[j] == all_promos[i].id && p_date <= today ) {
                promos.push(all_promos[i]);
                
            }
        }
    }
    return promos;
}


function getMallHours(){
    var hours=[];
    var all_hours = getPropertyHours();
    $.each(all_hours, function(i, v){
        if(v.store_id == null){
            hours.push(v);
        }
    })
    return hours;
}

function getHoursForIds(hour_ids){
    var hours=[];
    var all_hours = getPropertyHours();
    for (i = 0; i < all_hours.length; i++) {
        for (j = 0; j < hour_ids.length; j++) { 
            if(hour_ids[j] == all_hours[i].id){
                hours.push(all_hours[i]);
                
            }
        }
    }
    return hours;
}

function getJobsForIds(jobs_ids){
    var jobs=[];
    var all_jobs = getJobsList();
    for (i = 0; i < all_jobs.length; i++) {
        for (j = 0; j < jobs_ids.length; j++) { 
            if(jobs_ids[j] == all_jobs[i].id){
                jobs.push(all_jobs[i]);
                
            }
        }
    }
    return jobs;
}


function getPropertyID(){
    var all_stores = getStoresList();
    var property_id = all_stores[0].property_id;
    return property_id;
}

function getPropertyHours(){
    
    return JSON.parse(sessionStorage.mallData).hours;
}

function getRegHoursForDayIndex(day_index){
    var hours = getPropertyHours();
    for (i = 0; i < hours.length; i++) {
        if(!hours[i].is_holiday && hours[i].day_of_week == day_index && hours[i].store_id == null){
            return hours[i];
        }
    }
}

function getTodaysHours(){
    var hours = getPropertyHours();
    var day_of_week_hours;
    var holiday_hours;
    var today = new Date();
    for (i = 0; i < hours.length; i++) {
        if (hours[i].store_id === null){
            
            if(hours[i].is_holiday){
                
                var holiday_date = new Date(hours[i].holiday_date);
               
                if(today.getMonth() == holiday_date.getMonth() && today.getDate() == parseInt(holiday_date.getDate())+ 1){
                    if(hours[i].is_holiday_recurring_every_year){
                        holiday_hours =  hours[i];
                    }else if(today.getYear() == holiday_date.getYear()){
                        holiday_hours =  hours[i];
                    }
                }
            }    
            
            if(!hours[i].is_holiday && hours[i].day_of_week == today.getDay()){
                
                day_of_week_hours = hours[i];
            }
            
            
        }
        
    }
    if (holiday_hours){
        return holiday_hours;
    } else {
        return day_of_week_hours;
    }
    
}


function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}







function applyPromoJobsStyle(store_details){
    console.log(store_details)
    if(store_details.promotions.length > 0){
        store_details.has_promotions_css = "inline;";
    }else{
        store_details.has_promotions_css = "none;";
    }
    
    if(store_details.jobs.length > 0){
        store_details.has_jobs_css = "inline;";
    }else{
        store_details.has_jobs_css = "none;";
    }
}





function setLocaleDateFormats(hours){

    var open_time = new Date(hours.open_time);
    var close_time = new Date(hours.close_time);
     
    open_time_hour = open_time.getUTCHours();
    
    var open_time_hour_fr = open_time_hour;
    
    var open_time_period = "AM";
    if(open_time_hour >= 12){
        open_time_hour = open_time_hour -12;
        open_time_period = "PM";
    }
    if(open_time_hour === 0){
        open_time_hour = 12;
    }
    
    close_time_hour = close_time.getUTCHours();
    var close_time_hour_fr = close_time_hour;
    
    var close_time_period = "AM";
    if(close_time_hour > 12){
        close_time_hour = close_time_hour -12;
        close_time_period = "PM";
    }
    if(close_time_hour === 0){
        close_time_hour = 12;
    }
    
    open_time_min = open_time.getUTCMinutes();
    var open_time_min_fr = open_time_min;
    if(open_time_min === 0){
        open_time_min = "00";
        open_time_min_fr = "";
    }
    
    
    close_time_min = close_time.getUTCMinutes();
    var close_time_min_fr = close_time_min;
    if(close_time_min === 0){
        close_time_min = "00";
        close_time_min_fr = "";
    }
    
    
    hours.open_time_localized = open_time_hour + ":" + open_time_min + " " + open_time_period;
    hours.close_time_localized = close_time_hour + ":" + close_time_min + " " + close_time_period;
    
    hours.open_time_localized_fr =  open_time_hour_fr + "h" + open_time_min_fr;
    hours.close_time_localized_fr = close_time_hour_fr + "h" + close_time_min_fr;
    
    if(hours.holiday_date){
        var holiday_date = new Date(hours.holiday_date);
        holiday_date.setDate(holiday_date.getDate() + 1);
        hours.holiday_date_localized = holiday_date.toDateString();
    }
    
}




function getSearchResults(search_string,max_results,trim_description_length){
    var search_results = {};
    var all_stores = getStoresList();
    var store_ids = [];
    var stores =[];
    var count = 0;
    $.each( all_stores , function( key, val ) {
        localizeObject(val);
        if(store_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                stores.push(val);
                store_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(store_ids.indexOf(val.id) == -1){
            var tags_string = val.tags.join();
            var keywords_string  = val.keywords.join();
            if(search_string.length > 3 && (tags_string.toLowerCase().indexOf(search_string.toLowerCase()) > -1 || keywords_string.toLowerCase().indexOf(search_string.toLowerCase()) > -1)){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                stores.push(val);
                store_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        
        }
        
    });
    search_results['stores'] = stores;
    if(stores.length === 0){
        search_results['stores_header_style'] = "display:none";
    }
    
    
    
    //we only want to keep checking promos, events or jobs descriptions if there is more that 2 search string characters, otherwise too many results
    if(count >= max_results || search_string.length < 3){
        search_results['summary'] = {"count":count};
        search_results['promotions_header_style'] = "display:none";
        search_results['events_header_style'] = "display:none";
        search_results['jobs_header_style'] = "display:none";
        return search_results;
    }
    
    var all_promotions = getPromotionsList();
    var promotion_ids = [];
    var promotions =[];
    $.each( all_promotions , function( key, val ) {
        localizeObject(val);
        var added = false;
        if(promotion_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                promotions.push(val);
                promotion_ids.push(val.id);
                count++;
                added = true;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(!added){
            
            if(val.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                promotions.push(val);
                promotion_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['promotions'] = promotions;
    if(promotions.length === 0){
        search_results['promotions_header_style'] = "display:none";
    }
    
    
    var all_events = getEventsList();
    var event_ids = [];
    var events =[];
    $.each( all_events , function( key, val ) {
        localizeObject(val);
        var added = false;
        if(event_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                events.push(val);
                event_ids.push(val.id);
                added = true;
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(!added){
            
            if(val.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                events.push(val);
                event_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['events'] = events;
    if(events.length === 0){
        search_results['events_header_style'] = "display:none";
    }
    
    var all_jobs = getJobsList();
    var job_ids = [];
    var jobs =[];
    $.each( all_jobs , function( key, val ) {
        localizeObject(val);
        var added = false;
        if(job_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                jobs.push(val);
                job_ids.push(val.id);
                added = true;
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(!added){
            if(val.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                jobs.push(val);
                job_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['jobs'] = jobs;
    if(jobs.length === 0){
        search_results['jobs_header_style'] = "display:none";
    }
    
    search_results['summary'] = {"count":count};
    
    

    return search_results;
    
}


function initData(){
   
}

//Save contest form into MM db
function contestIntoMM(method, dataParam){
    var dataContest ={};
    dataContest['contest'] = dataParam;
    
	var ajaxUrl = "http://mallmaverickstaging.com/" + method;
	$.ajax({
        url: ajaxUrl,
        type: "POST",
        data: dataContest,
    	success: function(response){                        
		    
		},
        error: function(xhr, ajaxOptions, thrownError){
            alert("Please try again later.");
		}
    })
}

function getContestInfo(){
    var contest = {};
    contest['id'] = null;
    contest['first_name'] = null;
    contest['last_name'] = null;
    contest['property_id'] = null;
    contest['contest_id'] = null;
    contest['email'] = null;
    contest['phone'] = null;
    contest['postal_code'] = null;
    contest['age'] = null;
    contest['gender'] = null;
    contest['notes'] = null;
    contest['newsletter'] = null;
    contest['created_at'] = null;
    contest['updated_at'] = null;
    contest['city'] = null;
    contest['province'] = null;
    contest['birthday'] = null;
    return contest;
}

(function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
})();

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();


	