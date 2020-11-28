// get new activity from The Bored API and insert into ejs file with random color
const getActivity = () => {
  $.ajax({ 
    url: 'https://www.boredapi.com/api/activity',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: data => {
      let fontColors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9']
      let randColor = fontColors[Math.floor(Math.random() * fontColors.length)];
      let activity = document.getElementById('suggestedActivity');
      activity.innerHTML = data.activity.toLowerCase();
      activity.style.color = randColor;
    },
    error: function (error) {
        console.log(`getActivity Error: ${error}`);
    }
  })
}

// add activity and increment count in ejs file
const addActivity = () => {
  let activity = document.getElementById('suggestedActivity').innerHTML;  
  let newLine = document.createTextNode(activity);
  let li = document.createElement('li');
  let activityCount = parseInt(document.getElementById('activityCount').innerHTML);
  li.appendChild(newLine);  
  activityCount++
  document.getElementById('activityList').appendChild(li);
  document.getElementById('activityCount').innerHTML = activityCount.toString();
}

// save activity to database, then update page, then get a new activity.
const saveActivity = () => {
  let activityToSave = document.getElementById('suggestedActivity').innerHTML;
  $.ajax({ 
    url: '/add',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: { activity: activityToSave }, 
    success: data => {
      let newActivity = data.rows[0].activity
      console.log(`'${newActivity}' has been added`)
      addActivity();
    },
    error: function(error){
      console.log(`saveActivity Error: ${error}`);
    }
  })
  .done(getActivity());
};

// delete all activities from database, and set list to empty string, and count to 0
const deleteActivities = () => {
  $.ajax({ 
    url: '/delete',
    type: 'POST',
    success: data => {
      console.log(data);
      document.getElementById('activityList').innerHTML = '';
      document.getElementById('activityCount').innerHTML = '0';
    },
    error: function(error){
      console.log(`deleteActivities Error: ${error}`);
    }
  })
};

window.onload = getActivity();







