function Szalon(){
    return(
        <div class="appointment-popup">
        <div class="appointment-user-wrapper">
          <div class="user-avatar">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"/>
          </div>
      
          <div class="appointment-user">
            <span class="username">Dr Annah Konda</span>
            <span class="specialization">General practitioner</span>
            <span class="notation four">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
      
          <div class="appointment-location">
            <p>3337 Goldie Lane</p>
            <p>84025 Farmington, Utah</p>
      
          </div>
        </div>
        <div class="appointment-calendar">
          <div class="current-week">
            <span><i class="fa fa-calendar"></i> October 21 - 27, 2019</span>
            <div class="calendar-nav">
              <button type="button" class="prev">Prev</button>
              <button type="button" class="next">Next</button>
            </div>
          </div>
      
          <div class="calendar-wrapper">
            <div class="calendar-week">
              <ul>
                <li>Mon.</li>
                <li>Tue.</li>
                <li>Wed.</li>
                <li>Thu.</li>
                <li>Fri.</li>
                <li>Sat.</li>
                <li>Sun.</li>
              </ul>
            </div>
      
            <div class="calendar-hours">
              <ul>
                <li>
                  <ul>
                    <li>08:00</li>
                    <li>08:15</li>
                    <li>08:30</li>
                    <li>08:45</li>
                    <li>09:00</li>
                    <li>09:15</li>
                    <li>09:30</li>
                  </ul>
                </li>
      
                <li>
                  <ul>
                    <li>08:00</li>
                    <li>08:15</li>
                    <li>08:30</li>
                    <li class="empty"></li>
                    <li>09:00</li>
                    <li>09:15</li>
                    <li>09:30</li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                  </ul>
                </li>
      
                <li>
                  <ul>
                    <li>08:00</li>
                    <li>08:15</li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li>09:15</li>
                    <li>09:30</li>
                  </ul>
                </li>
      
                <li>
                  <ul>
                    <li class="empty"></li>
                    <li>08:15</li>
                    <li>08:30</li>
                    <li>08:45</li>
                    <li>09:00</li>
                    <li>09:15</li>
                    <li>09:30</li>
                  </ul>
                </li>
      
                <li>
                  <ul>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                  </ul>
                </li>
      
                <li>
                  <ul>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                    <li class="empty"></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
      
      
          <div class="calendar-buttons">
            <button class="see-more" type="button">More schedule</button>
            <button class="validation" type="button">Book an appointment</button>
          </div>
        </div>
      </div>
      
    );


}

export default Szalon