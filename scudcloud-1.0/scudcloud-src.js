var ScudCloud = {
	overrideNotifications: function(){
		TS.ui.growls.no_notifications = false;
		TS.ui.growls.checkPermission = function() { return true; };
		TS.ui.growls.getPermissionLevel = function() { return 'granted'; };
		TS.ui.growls.show = function(j,f,o,p){ desktop.sendMessage(j,f); };
		TS.ui.banner.close();
	},
	overrideConnect: function(){
		TS.ms.connected_sig.add(function(){ScudCloud.connect(true);});
		TS.ms.disconnected_sig.add(function(){ScudCloud.connect(false);});
	},
	overrideBanner: function(){
		ScudCloud.showBanner = TS.ui.banner.show;
		TS.ui.banner.show = function(){ ScudCloud.showBanner(); ScudCloud.overrideNotifications(); };
	},
	connect: function(b){
		desktop.enableMenus(b);
		if(b) desktop.populate(JSON.stringify({'channels': ScudCloud.listChannels(), 'teams': ScudCloud.listTeams(), 'icon': TS.model.team.icon.image_44}));
	},
    count: function(){
		var total=0;
		$('span.unread_highlight').not('.hidden').each(function(i){ 
			total+= new Number($(this).text().replace('+','')); }
		);
		return total;
    },
	createSnippet: function(){
		return TS.ui.snippet_dialog.start();		
	},
    listChannels: function(){
		return TS.channels.getUnarchivedChannelsForUser();
	},
    listTeams: function(){
		var list = TS.getAllTeams();
		// Fix for current team displaying no icon
		list[0].team_icon = {"image_44":TS.model.team.icon.image_44};
		return list;
	},
    quicklist: function(){
		desktop.quicklist(ScudCloud.listChannels());
	},
	join: function(c){
		return TS.channels.join(c);
	},
	setClipboard: function(data){
		TS.client.ui.file_pasted_sig.dispatch(data, TS.model.shift_key_pressed);
	},
    preferences: function(){
		return TS.ui.prefs_dialog.start();
	},
    addTeam: function(){
		document.location = TS.boot_data.signin_url;
	},
	getCurrentTeam: function(){
		var list = TS.getAllTeams();
		if(list!=null) for(var i=0;list.length;i++){
			if(list[i].team_url==TS.boot_data.team_url){
				return list[i].id;
			}
		}
		return "";
	},
    logout: function(){
		document.location = TS.boot_data.logout_url;
	},
    help: function(){
		return TS.help_dialog.start();
	},
    isConnected: function(){
        return "undefined" != typeof TS && "undefined" != typeof TS.model && TS.model.ms_connected;
    },
	gotoNextOpenChannelOrIM: function(unreads_only, backwards){
		return TS.client.ui.gotoNextOpenChannelOrIM(unreads_only, backwards);
	},
};
if("undefined" != typeof TS){
	document.onpaste = function(e){desktop.pasted(false);};
    ScudCloud.overrideNotifications();
	ScudCloud.overrideConnect();
	ScudCloud.overrideBanner();
}
