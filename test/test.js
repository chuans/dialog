import casper from 'casperjs';

casper = casper.create();

casper.start('./index.html');

casper.then(function(){
    this.click('#custom');
})