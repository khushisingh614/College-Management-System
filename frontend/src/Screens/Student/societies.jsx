import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Heading from "../../components/Heading";

const Societies = () => {
  const [activeSociety, setActiveSociety] = useState(null);

  const handleToggle = (key) => {
    setActiveSociety(activeSociety === key ? null : key);
  };

const societies = [
    {
      key: "acm",
      title: "ACM",
      image: require("../../assets/acm.png"), // replace with actual image path
      color: "primary"
    },
    {
      key: "akriti",
      title: "Akriti",
      image: require("../../assets/akriti.png"),
      color: "success"
    },
    {
      key: "Cinephilia",
      title: "Cinephilia ",
      image: require("../../assets/Cinephilia.png"),
      color: "warning"
    },
    {
      key: "DRISHTI",
      title: "DRISHTI",
      image: require("../../assets/drishti.png"),
      color: "danger"
    },
    {
      key: "malang",
      title: "Malang",
      image: require("../../assets/malang.png"), 
      color: "info"
    },
    {
      key: "raag",
      title: "RAAG",
      image: require("../../assets/raag.png"),
      color: "dark"
    },
    {
        key: "chintan",
        title: "Chintan Pratishthan",
        image: require("../../assets/chintan.png"),
        color: "dark"
    },
    {
        key: "convex",
        title: "CONVEX ",
        image: require("../../assets/convex.png"),
        color: "warning"
    },
    {
        key: "renesa",
        title: "RENESA",
        image: require("../../assets/drishti.png"),
        color: "danger"
    },
  ];
  

  return (
    <div className="container mt-4">
      <Heading title="Student Societies & Chapters" />
      <br />
      <div className="row g-4">
        {societies.map((society) => (
          <div key={society.key} className="col-md-4">
            <div className={`card text-white bg-${society.color} shadow-lg text-center p-3`}>
              <div className="card-body">
              <div className="display-4 mb-2">
                <img
                    src={society.image}
                    alt={society.title}
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                />
                </div>
                <h5
                    className="card-title mt-2"
                    style={{ fontSize: "1.50rem", fontWeight: "bold" }}
                    >
                    {society.title}
                    </h5>
                <button
                  className="btn btn-light mt-3"
                  onClick={() => handleToggle(society.key)}
                >
                  {activeSociety === society.key ? "Hide" : "Show"} Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Society Details Section */}
      <div className="mt-4">
        {activeSociety === "acm" && (
          <div className="alert alert-primary">
            <Heading title ="ACM" />
            <br />
            <p>ACM is an International Learned Society for Computing. It has its chapters in various institutes. It brings together computing educators, researchers, and professionals to inspire dialogue, share resources, and address the field's challenges. As the world’s largest computing society, ACM strengthens the profession's collective voice through strong leadership, promotion of the highest standards, and recognition of technical excellence. It supports the professional growth of its members by providing opportunities for life‐long learning, career development, and professional networking.</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. ACM Summer Challenge: A long coding challenge to first learn and solidify the programming concepts and then compete among themselves to solve some mind-blowing problems in the contest.</li><br />
              <li>2. Inception: A half-yearly Competitive Coding contest, organized on Codeforces to display and enhance coding abilities of participants.</li><br />
              <li>3. Epiphany: A half-yearly Inter College Competitive Coding contest for all the coding enthusiasts out there. It is organized on Codeforces to test the programming skills and to push the limits of participants.</li><br />
              <li>4. Hour of Code: It is a global movement introducing tens of millions of students worldwide to computer science, inspiring kids to learn, breaking stereotypes, and leaving them feeling empowered. It aims to explain the importance of Computer Science in our daily lives and in various fields, to students of class 9 to class 12, through presentations conducted in virtual mode. Apart from this, we also encourage the students to gain more knowledge in the CS field.</li><br />
              <li>5. ACM Month of Code (AMOC): AMOC as the name suggests, is a month-long contest to learn and innovate. It brings the chance to build something cool on any topic from scratch and using any tools. The event runs for a month and during this time participants can learn, utilize their skills and develop their ideas into reality.</li><br /> 
            </ul>
          </div>
        )}

        {activeSociety === "akriti" && (
          <div className="alert alert-success">
            <Heading title ="Akriti" />
            <br />
            <p>Akriti, the artistic soul of CHRD, is the most vibrant club with beaming colourful, diverse personalities. It is not only an art club but a serene place to escape from the tedious rigmarole of daily life. It is a group of madly talented people (stress on madly) coming together to paint the vivid memories of their life. Art is not only about colours, strokes, and details; it is about forming a “Line around your Thoughts.”
So, let’s pick up those brushes and enjoy the company of the colours!</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. Sculpture Workshop: Akriti Chrd hosted a sculpture making workshop presented by a professional architect and sculptor Mr. Abhijit Pariyal on 28/08/2022. In this workshop students were guided through the various stages of creating sculptures and materials were provided to them prior to the workshop. It was open for everyone who wanted an unforgettable, creative experience.</li><br />
              <li>2. Rangavali:: An online rangoli-making competition where students explore Indian culture and take part in the holy festivities of Diwali. Akriti not only celebrates Diwali with the gleam of diyas but also spreads the festive cheers with art and creativity.</li><br />
              <li>3. Wall Painting: Various wall paintings in the college, whether it be on the walls of different hostels or on the walls of the workshop, akriti owns all of it. Few walls outside the gates of SVNIT are also painted by Akriti.</li><br />
              <li>4. Sculpture Workshop: Akriti Chrd hosted a sculpture making workshop presented by a professional architect and sculptor Mr. Abhijit Pariyal on 28/08/2022. In this workshop students were guided through the various stages of creating sculptures and materials were provided to them prior to the workshop. It was open for everyone who wanted an unforgettable, creative experience.</li><br />
              <li>5. Arten: A week-long competition, where various painting styles are pondered via artworks. Participants polish their expertise under the enlightenment of skilled senior members and exchange creativity and imagination.</li><br /> 
            </ul>
          </div>
        )}

        {activeSociety === "Cinephilia" && (
          <div className="alert alert-warning">
            <Heading title ="Cinephilia" />
            <br />
            <p>Cinephilia - the movie-making club of CHRD, is a small independent group of movie enthusiasts who came along to learn about movies. A movie isn’t just shots edited together to present a story; it is a collective effort of director, writer, cinematographer, soundtrack editors, and more. This student chapter shows a culture of acting, directing, and shooting in small feature movies. These movies please the heart like smelling the orchid in the valley of garlands and deliver a heart-touching message through their screenings</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. CineBattle: cinebattle is a week long short movie making competition. 3 teams took part in it and made a 10-15 minutes movie with proper cinematography. The films were properly screened as a great event and best film and best director were awarded.</li><br />
              <li>2. 48-Hour Reel Making Competition: On 12th September 2022, Cinephilia announced the Reel Making Competition on its Instagram page. Participants were invited to make reels about “A day in the life at SVNIT”. The competition was open to all and the deadline was set to 18th September 2022.</li><br />
              <li>3. 48 hours movie-making competition: A 2-day long movie-making competition designed especially for the freshers. This competition will teach you the values of resources and time management like no other. Making a movie under two days involves creating a story, shooting, and then editing the whole movie in that minimal amount of time. Isn’t it challenging yet thrilling?</li><br />
              <li>4. Cinewood:A cinephilia production, where students participate in a competition, direct, write, edit and produce a small movie, with the help of experienced members of the club. This competition develops team collaboration and skill development in movie-making.</li><br />
              <li>5. Maya: A nexus of Storytelling and the future Corporate world, i.e. Visual Advertisement Making. Maya is a perfect blend of creative and rational minds coming together to create a “MAYA” representing Young Indias’ Vision.</li><br /> 
            </ul>
          </div>
        )}

        {activeSociety === "DRISHTI" && (
          <div className="alert alert-danger">
            <Heading title ="DRISHTI" />
            <br />
            <p>DRISHTI is engaged in spreading technical knowledge at SVNIT and is made up of a group of curious people who are eager to share what we have learned via our experiences and experiments through a variety of workshops, seminars, events, and hands-on application.
            Drishti actively participates in many competitions like ROBOCON, International Rover Challenge(IRC), International Rover Design Challenge(IRDC), Azeotropy(IIT bombay Techfest), Texas Innovation Design Challenge, International Mars Hackathon etc we also develop various technologically oriented projects such as Exoskeleton,Rover,Centrifugal Pump, Prefabricated Building, Computer Vision & ML applications, and so on.</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. ORIENTATION - Orientation is the first session for first-year students to give them an overview of Drishti, how they could get involved with the club in the future along with a demonstration of previously accomplished projects.</li><br />
              <li>2. GRP - This event is the first event which aims to attract students to ignite their creative minds to build a bot which will compete with each other.</li><br /> 
              <li>3. TECHNOVATION - The event will have four exciting competitions from different domains, each consisting of a problem statement that has to be solved within the given time.</li><br />
              <li>4. WORKSHOP - Workshop is organized for first yearites to increase their knowledge in various domains like Mechanical, Chemical, Electronics and Civil.</li><br />
              <li>5. MAKERSPACE - It is an event conducted exclusively for first-year students to gain knowledge. Students are given a challenging yet enlightening project which has to be completed within a time limit in which mentors are assigned to each team.</li><br />
            </ul>
          </div>
        )}

        {activeSociety === "renesa" && (
          <div className="alert alert-danger">
            <Heading title ="RENESA" />
            <br />
            <p>Renesa is the Official Media and Publication House of Sardar Vallabhbhai National Institute of Technology, Surat. We function as the institute's primary college publication, institutionalized by the official Student Council Constitution. Renesa's primary aim is to keep the people of SVNIT well-informed and fully aware of important issues, events, and achievements related to the college and serve as a platform for the creative expression of thoughts through writing and design.</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. Renesa has published several magazines, yearbooks, and newsletters in the past. These publications contained interviews with prominent personalities, SVNIT professors, SVNIT students/alumni, articles/stories/poems written by both Renesa members and SVNIT students/faculty, photographs of college activities/events, annual department-wise photographs of each graduating final-year batch, illustrations of college life, and much more.</li><br />
              <li>2. Renesa has published several YouTube videos featuring interviews with SVNIT Student Council members, student chapter heads, a campus tour video, interviews discussing foreign internships, and explanation videos for the SVNIT Elections and official Student Council Constitution.</li><br /> 
              <li>3. Renesa has published several episodes on its podcast, "Renesa Unscripted", mainly focusing on interviews discussing preparation for GRE, Masters in the United States, UPSC, GATE, and CAT. It also includes an episode called “2021: Forecast” that features a humorous news report of the upcoming events of 2021.</li><br />
              <li>4. Renesa will run an SVNIT Newsletter (published every 4 months) that contains reports and articles about both past and upcoming events/activities of all the student chapters of SVNIT, along with reports of achievements by the college’s students.</li><br />
              <li>5. GeekEnd: It is a weekend contest full of exciting events to challenge, test the skills and enhance the participant’s coding ability and technical knowledge.</li><br />
            </ul>
          </div>
        )}

        {activeSociety === "malang" && (
          <div className="alert alert-info">
            <Heading title ="Malang" />
            <br />
            <p>Malang the Dance Club of SVNIT Surat. It deals with all styles of Dances like classical, bollywood, freestyle, and whatnot. Malang organizes Group Dance events, workshops, and competitions all year round to keep up the Dancing Spirit alive! If a particular dance style exists, there'll be someone at Malang who knows how to do it. There's so much to learn here that it never gets boring. A rhythm and a little space are all we ever ask for when we promise you a once-in-a-lifetime performance!</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. Dance Jam: This is a group dance competition with participation from all the years. Serving as an icebreaker for second and third yearites it gives a good chance to hone and develop one’s skills. The competition consists of two rounds, one of which takes place on the day of team formation itself. And after a fortnight’s preparation the group performs in the second round for a choreo of 1-1.5 minutes.</li><br />
              <li>2. Wavezz: Online Dance competitions for solo dancers where students from all years and even alumni compete against each other. Wavezz is not just an event; it is a medium to help fresh talent lose the stage fright that usually comes while performing alone and putting yourself out there in front of large masses on social media.</li><br /> 
              <li>3. Hustle: An evening dedicated to self-expression and exploration. An event where the stage is ‘all yours’, quite literally. We, at Malang CHRD, like to call this event ‘Hustle’ - a flagship event for solo dancers that includes dance battle and face-off rounds. Hustle gives you a chance to portray your art and make the ones’ witnessing absolutely spellbound by expressing yourself to the fullest and connecting with the audience.</li><br />
              <li>4. 3 Dancers 1 Song: Only one song, 3 dancers with 3 different interpretations and styles! Fascinating, right? You will understand how other styles can be performed on a single piece, which will surely increase your understanding of the different dance styles.</li><br />
              <li>5. Dance Macha: A theme-based group dance competition. This is an ice breaker event for 1st-year students where they will get familiar with Malang’s atmosphere. Here, the freshers interact with senior members and develop communication & networking skills, while on the other hand, seniors take up the lead while enjoying their favourite - dance.</li><br />
            </ul>
          </div>
        )}

        {activeSociety === "raag" && (
          <div className="alert alert-dark">
            <Heading title ="RAAG" />
            <br />
            <p>Every feeling in this world can be expressed through music. There is no limit to music, and hence it has an immense reach among us. Just like that, Raag is a feeling. From strumming the strings to drumming the beats, there is no partiality from the classical taste of violin to rock bass. Raag, another vibrant pillar of CHRD, focuses on nurturing and enriching students' musical taste, keeping in mind the core essence of CHRD. Students get to participate and get exposure to various musical activities throughout the academic year and develop and acquire an affluent area of musical skills. Sitting with instruments and singing in unison on the lawns creates a different vibe and makes everyone rejuvenate after a long day.</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. Encore: After almost 3 years of online events, it was the first offline event. Raag members enthusiastically participated and new talents along with older gems came out to showcase what they have got. Together they made it a very auspicious and remarkable event. The whole event was a mixture of melody and joy. Raag presented varieties of genres of music. It included Bollywood, western, classical and so much more.</li><br />
              <li>2. Unplugged: An evening dedicated to the development of music, where numerous new genres of music are explored by the students of CHRD. The event brings in various musicians from our college to create the most exuberant atmosphere for people.</li><br /> 
              <li>3. Music Trails: This evening jamming session shows the freshers what Raag is, showcasing our skills and talents. Here we encourage freshers to come and join Raag, be a part of our Elite Gang. This is a small concert where people cheer, hoot, sing together, waving their hands and flashing lights to make a scenic event.</li><br />
              <li>4. Distunes: An online solo singing competition showcasing the various music forms and languages, where students compete against each other and shine with their music skills.</li><br />
              <li>5. FreshBeat: An online singing competition where students from the first year work in a team environment by forming groups or bands with their peers and create small music recordings.</li><br />
            </ul>
          </div>
        )}

        {activeSociety === "chintan" && (
          <div className="alert alert-danger">
            <Heading title ="Chintan Pratishthan" />
            <br />
            <p>Chintan Pratishthan is a student group led by the B. Tech., M. Tech., MSc., and PhD students of SVNIT. This group's initial objective was to look into many crucial national issues and find better ways to incorporate technological advancements to fulfill the requirements of our society today. The group as a whole is eager to help whenever feasible with any efforts that benefit our society and people. We also host a variety of events, including talk programmes with distinguished authorities in their fields, celebrations of cultural occasions, business excursions, workshops, and more.</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. Prashikshan Varg :An annual training camp lasting two days is held outside of Surat. Students attend sessions from experts throughout the course of these two days on a wide range of topics. The entire day is filled with activities and games in addition to that.</li><br />
              <li>2. Startup and Innovation Talks :A talk by Hiranmay Mahanta ( CEO, iHub Gujarat) on "Startup And Innovation" was organised by Chintan Pratishthan . He graduated from our college and founded numerous startups. He is now using his knowledge and drive to support and expand INDIA's startup and innovation ecosystem. Additionally, he spoke with the pupils about SSIP funding.</li><br /> 
              <li>3. Aarambh:It is the Orientation program Chintan Pratishthan members highlighted the mission, vision, objectives, and strong alumni network as well as provided a sneak peek at a number of the activities that the Student Chapter organises throughout the year. Additionally, there will be an interactive discussion with our special guest, Mr. Jayvir Gadhvi, Deputy Collector at the Vadodara Collectorate and alumni of SVNIT who received a score of 341 on the UPSC-CSE and Rank 1 in the GPSC for 2020. (2021).</li><br />
            </ul>
          </div>
        )}

        {activeSociety === "convex" && (
          <div className="alert alert-danger">
            <Heading title ="CONVEX" />
            <br />
            <p>
            Convex is the photography club of CHRD. Every event ever that happened in SVNIT is directly a part of Convex because they are always there to capture those moments which can be cherished forever. From orientations to workshops to marathons to mega nights to fests, everything links back to Convex, as the exclusive photography club of our institute. This student chapter knows the value of patience and persistence, which can be seen in photos captured through their lenses.</p>
            <br />
            <Heading title ="Events" />
            <br />
            <ul>
              <li>1. Convex has put up its photography skills to cover almost all events that have happened in the college till date. Eureka (RIAC), Building Quantum Computers using atoms and Strategy to crack GATE and IES(CP), UPSC as career choice: what and how? (CAC), Swaranjali (SPICMACAY), Litfest (LAC), Encore (Raag, CHRD), Rangmanch (Kirdaar, CHRD) and Dance Jam (Malang, CHRD) are some covered events. Moreover, they have also covered collage marathon, Ganesh Charuthi, Ganesh Visharjan and talk on Our Prime Minister: His dreams and vision.</li><br />
              <li>2. Pratibimb : An exhibition organised during Sparsh/Mindbend showcasing the beautiful photographs captured by the students. It is an anticipated event and though its unveilings are subtle, it leaves a lasting impact on the people who visit it. Photos of different genres, subjects, capturing the best of our surroundings indeed leave everyone in awe!</li><br /> 
              <li>3. Photowalk : An early morning walk around the campus of SVNIT to capture beautiful scenery via the camera lens. If you like nature, cold mornings, photography and maybe a bit of walking one thing you should definitely do is to join us in one of our photowalks.</li><br />
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Societies;