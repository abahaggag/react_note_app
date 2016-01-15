var Note = React.createClass({displayName: "Note",
	getInitialState: function(){
		return {editing: false}
	},

	componentWillMount: function(){
		this.style = {
			right: this.randomBetween(0, window.innerWidth - 150) + 'px',
			top: this.randomBetween(40, window.innerHeight - 190) + 'px',
			transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
		};
	},

	componentDidMount: function(){
		$(this.getDOMNode()).draggable();
	},

	randomBetween: function(min, max) {
		return (min + Math.ceil(Math.random() * max));
	},

	edit: function(){
		this.setState({editing: true});
	},

	save: function(){
		var newText = this.refs.newText.getDOMNode().value;
		var i = this.props.index;

		this.props.onChange(newText, i);
		this.setState({editing: false});
	},

	remove: function(){
		this.props.onRemove(this.props.index);
	},

	
	renderDisplay: function(){
		return  React.createElement("div", {className: "note", style: this.style}, 
							React.createElement("p", null, this.props.children), 
							React.createElement("span", null, 
								React.createElement("button", {onClick: this.edit, 
												className: "btn btn-primary glyphicon glyphicon-pencil"}), 
								
								React.createElement("button", {onClick: this.remove, 
												className: "btn btn-danger glyphicon glyphicon-trash"})
							)
						);
	},

	renderForm: function(){
		return 	React.createElement("div", {className: "note", style: this.style}, 
							React.createElement("textarea", {ref: "newText", defaultValue: this.props.children, className: "form-control"}), 
							React.createElement("button", {onClick: this.save, 
											className: "btn btn-success btn-sm glyphicon glyphicon-floppy-disk"})
						);
	},

	render: function(){
		if (this.state.editing){
			return this.renderForm();
		}
		else{
			return this.renderDisplay();
		}

	}
});

var Board = React.createClass({displayName: "Board",
	propsTypes: {
			count: function(props, propName){
					if (typeof(props[propName]) !== "number"){
						return new Error("The count property must be a number.");
					}

					if (props[propName] > 100){
						return new Error("Creating " + props[propName] + " notes is rediculous.");
					}
			}
	},

	getInitialState: function() {
		return {
			notes: []
		};
	},

	nextId: function(){
		this.uniqueId = this.uniqueId || 0;
		return this.uniqueId++;
	},

	componentWillMount: function(){
		
	},

	downloadNotes: function(){
		$(".downloadNotes").html("loading ...");
		var ans = confirm("Are you sure to download your notes from http://baconipsum.com");
		
		if (ans){
			var self = this;
			if(this.props.count) {
				$.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" + this.props.count + "&start-with-lorem=1&callback=?", function(results){
					results[0].split(". ").forEach(function(sentence){
						self.add(sentence.substring(0,40));
					});
				});
			}
		}
		$(".downloadNotes").html("Load Notes");

		
	},

	add: function(text){
		var arr = this.state.notes;
		arr.push({
			id: this.nextId(),
			note: text
		});
		this.setState({notes: arr});
	},

	update: function(newText, i){
		var arr = this.state.notes;
		arr[i].note = newText;
		this.setState({notes: arr});
	},

	remove: function(i){
		var arr = this.state.notes;
		arr.splice(i, 1);
		this.setState({notes: arr});
	},

	removeAll: function(){
		var ans = confirm("Are you sure to remove all notes?");
		var msg;
		if(ans){
			this.setState({notes: []});
			msg = "All notes have been deleted successfully.";
		}
		else{
			msg = "Removing command is canceled by the user.";
		}
		
		alert(msg);
	},

	eachNote: function(note, i){
		return 	React.createElement(Note, {key: note.id, index: i, onChange: this.update, onRemove: this.remove}, 
							note.note
						);
	},

	render: function(){
		return 	React.createElement("div", {className: "board"}, 
							this.state.notes.map(this.eachNote), 
							React.createElement("button", {className: "btn btn-sm btn-success glyphicon glyphicon-plus", onClick: this.add.bind(null, "New Note")}), 
							React.createElement("button", {className: "btn btn-sm btn-danger glyphicon glyphicon-remove removeAll", onClick: this.removeAll}), 
							React.createElement("button", {className: "btn btn-sm btn-warning downloadNotes", onClick: this.downloadNotes}, "Load Notes")
							
						);
	}
});

React.render(React.createElement(Board, {count: 20}), document.getElementById("react-container"));