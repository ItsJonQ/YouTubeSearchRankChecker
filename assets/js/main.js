jQuery.noConflict();
(function($) {
	$(function() {
		getUrlParam = function(key){
			var theUrl = window.location;
			var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
			return result && unescape(result[1]) || ""; 
		};

		function formatDate(d) {

		   var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		    var y = d.getFullYear().toString();
		    var m = months[d.getMonth()];
		    var d = d.getDate();

		    return m + " " + d + ", " + y;
		}

		if(getUrlParam('user') != '') {
			$('#search-user').val(getUrlParam('user'));
		}

		$('#search-input').submit(function(e){
			e.preventDefault();
			var i = $('#search-query').val();
			var u = $('#search-user').val();
			searchQuery(i, u);
		});

		var searchQuery = function(query, username) {
			var searchUrl = 'http://gdata.youtube.com/feeds/api/videos?q='+query+'&max-results=20&alt=json&v=2';
			$('#results-list').html('');
			$.getJSON(searchUrl, function(data) {
				var feed = data.feed;
				var entries = feed.entry;
				$.each(entries, function(i,data) {
					var title = data.title.$t;
					var id = data.id.$t.split(':')[3];
					var user = data.author[0].name.$t;
					var date = new Date(data.published.$t);
					var description = data.media$group.media$description.$t;
					var thumb = data.media$group.media$thumbnail[0].url;
					$('#results-list').append('<li data-video-id="'+id+'" class="user-'+user.toLowerCase()+'"><div class="thumbnail"><img src="'+thumb+'" width="120" height="90"></div><div class="content clearfix"><div class="video-title"><strong">'+title+'</strong></div><div class="text-light">by <span id="username-'+user+'">'+user+'</span> - '+formatDate(date)+'</div></div></li>');
				});
				
				var searchRank = function() {
					var filter = $('#results-list').find('.user-'+username),
						rank = parseInt(filter.index()) + 1,
						message = '<span>'+username +'</span> is ranked <strong class="the-ranking">'+rank+'</strong>',
						title = filter.first().find('.video-title').text(),
						videoTitle = '<div class="text-light">Video Title: <strong>'+title+'</strong></div>';
					if(rank <= 0) {
						message = username +' is <strong>not ranked</strong>';
						videoTitle = '';
					}
					filter.addClass('highlighted');
					$('#search-rank').html('<h3 class="text-thin">'+message+' for "<span>'+query+'</span>"</h3>'+videoTitle+'<hr>');
				};
				searchRank();
			});
		}

	});
})(jQuery);