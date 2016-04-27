var ExampleApplication = React.createClass({
  render: function() {
    console.log(this)
    var elapsed = Math.round(this.props.elapsed  / 100);
    var seconds = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
    var message =
      'React has been successfully running for ' + seconds + ' seconds.';

    return <p>{message}</p>;
  }
});

var start = new Date().getTime();

setInterval(function() {
  React.render(
    <ExampleApplication elapsed={new Date().getTime() - start}  name="huhai" xx='yy'/>,
    document.getElementById('container')
  );
}, 50);
