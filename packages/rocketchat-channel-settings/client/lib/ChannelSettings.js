RocketChat.ChannelSettings = new class {
	constructor() {
		this.options = new ReactiveVar({});
	}

/*
	 * Adds an option in Channel Settings
	 * @config (object)
	 *   id: option id (required)
	 *   template (string): template name to render (required)
	 *   validation (function): if option should be displayed
 */
	addOption(config) {
		if (config == null || config.id == null) {
			return false;
		}
		return Tracker.nonreactive(() => {
			const opts = this.options.get();
			opts[config.id] = config;
			return this.options.set(opts);
		});
	}

	getOptions(currentData, group) {
		const allOptions = _.toArray(this.options.get());
		const allowedOptions = _.compact(_.map(allOptions, function(option) {
			if (option.validation == null || option.validation()) {
				option.data = Object.assign({}, option.data, currentData);
				return option;
			}
		})).filter(function(option) {
			return !group || !option.group || option.group.includes(group);
		});
		return _.sortBy(allowedOptions, 'order');
	}
};
