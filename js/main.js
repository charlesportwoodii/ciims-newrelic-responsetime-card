;(function() {
	/**
	 * Weather Card
	 */
	var NewRelicResponseTimeCard = new CardPrototype({

		/**
		 * @var string 	The name of this card
		 */
		name: "NewRelicResponseTimeCard",

		init: function() {
			$.getScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.1/Chart.min.js");
		},

		preload: function() {},
		render: function() {
			var self = this,
				apiKey = self.getApiKey(),
				appId = self.getAppId();

			if (self.addError() == false)
				return false;

			self.getSummarizedData();
			self.getUnsummarizedData();			
		},

		/**
		 * Reload overwrite - handles cases were data isn't appropriatly set
		 */
		reload: function() {
			$("#" + this.id + " #card-settings-button").removeClass("fa-pulse");
			$("#" + this.id + " .configwarning").hide();
			this.render();
		},

		/**
		 * Retrieves the API key
		 */
		getApiKey: function() {
			return CardPrototype.prototype.getProperty(this, "nrapdex_API_key");
		},

		/**
		 * Retrieves the App ID
		 */
		getAppId: function() {
			return CardPrototype.prototype.getProperty(this, "nrapdex_app_id");
		},

		/**
		 * Retrieves the App ID
		 */
		getDTS: function() {
			return CardPrototype.prototype.getProperty(this, "nrapdex_dts");
		},

		/**
		 * Retrieves and displays the summarized data
		 */
		getSummarizedData: function() {
			var self = this,
				to = new Date(),
				from = new Date();

			from.setDate(from.getDate() - self.getDTS());

			$.ajax({
				type: "GET",
				url: "https://api.newrelic.com/v2/applications/" + self.getAppId() + "/metrics/data.json",
				headers: {
					"X-Api-Key": self.getApiKey()
				},
				data: {
					names: [
						"Agent/MetricsReported/count"
					],
					from: from.toISOString(),
					to: to.toISOString(),
					summarize: true
				},
				success: function(data, textStatus, jqXHR) {
					var metrics = data.metric_data.metrics[0].timeslices[0].values;

					// Display the min/max/average repsonse times
					$("#" + self.id + " .average").text(metrics.average_response_time + "ms");
					$("#" + self.id + " .min .fa").text(metrics.min_response_time + "ms");
					$("#" + self.id + " .max .fa").text(metrics.max_response_time + "ms");
				},
				error: function(data) {
					self.addError();
				}
			});
		},

		/**
		 * Retreives unsummarized data, and displays a line chart
		 */
		getUnsummarizedData: function() {
			var self = this,
				to = new Date(),
				from = new Date();

			from.setDate(from.getDate() - self.getDTS());

			$.ajax({
				type: "GET",
				url: "https://api.newrelic.com/v2/applications/" + self.getAppId() + "/metrics/data.json",
				headers: {
					"X-Api-Key": self.getApiKey()
				},
				data: {
					names: [
						"Agent/MetricsReported/count"
					],
					from: from.toISOString(),
					to: to.toISOString(),
					summarize: false
				},
				success: function(data, textStatus, jqXHR) {
					var metrics = data.metric_data.metrics[0].timeslices,
						labels = [],
						datasets = [],
						ctx = $("#"+self.id+" .newrelicresponsetimechart").get("0").getContext("2d");

					$.each(metrics, function() {
						labels.push("");
						datasets.push(this.values.average_response_time);
					});
					
					var myLineChart = new Chart(ctx).Line({
					    labels: labels,
					    datasets: [
					        {
					            label: "My First dataset",
					            fillColor: "rgba(151,187,205,0.2)",
					            strokeColor: "rgba(151,187,205,1)",
					            pointColor: "rgba(151,187,205,1)",
					            pointStrokeColor: "#fff",
					            pointHighlightFill: "#fff",
					            pointHighlightStroke: "rgba(151,187,205,1)",
					            data: datasets
					        },
					    ]
					}, {
						scaleShowGridLines: false,
						scaleShowHorizontalLines: false,
						pointDotRadius: false,
						pointHitDetectionRadius: 1,
						datasetStrokeWidth: 1
					});
				},
				error: function(data) {
					self.addError();
				}
			});
		},

		/**
		 * Handles the error handling for the two data sources
		 */
		addError: function() {
			var self = this;
			if (self.isEmpty(self.getApiKey()) || self.isEmpty(self.getAppId()))
			{
				$("#" + this.id + " #card-settings-button").addClass("fa-pulse");
				$("#" + this.id + " .configwarning").show();
				return false;
			}

			return true;
		},

		/**
		 * Checks if a string is empty or not
		 * @param string str
		 */
		isEmpty: function(str) {
			if (str == null)
				return true;

		    return (!str || 0 === str.length);
		}
	});
}(this));
