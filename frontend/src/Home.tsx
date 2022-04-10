import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import {
  Container,
  Content,
  ContentHeading,
  TwitterTimeline,
} from "./components/Common";
import { ABOUT_TEXT, PAST_WINNERS, SCORING } from "./components/HomeConstants";
import { Table, TBODY, TD, TH, THEAD, TR } from "./components/Tables";

export function Home() {
  return (
    <>
      <Container>
        <ContentHeading>About</ContentHeading>
        {ABOUT_TEXT}
        <ContentHeading>Scoring</ContentHeading>
        <Table headings={["round", "score"]} rows={SCORING} />
        <ContentHeading>Past Winners</ContentHeading>
        <Table
          headings={["year", "name", "points", "knowledge"]}
          rows={PAST_WINNERS}
        />
        <ContentHeading>March Madness on Twitter</ContentHeading>
        <TwitterTimeline
          sourceType="profile"
          screenName="MarchMadnessMBB"
          options={{ height: 500 }}
        />
        <ContentHeading>Acknowledgements</ContentHeading>
        <Content>
          A sincere thank you goes to Parker Lawrence ('19), Caleb Smith ('18)
          and Atif Niyaz ('16). The original site to host the bracketology
          project was the idea and creation of Atif Niyaz. Atif created and
          coded the original website along with running the logistics of the
          site for two years. In 2018, Caleb Smith redid the work of Atif to
          improve upon what had already been created. Caleb, specifically,
          developed the site layout and most importantly the bracket submission
          page. In 2019, Parker Lawrence took what Caleb developed and automated
          the standings and data analysis pages in addition to doing other
          things that are too complicated for most of us to understand. All
          three of these individuals invested a lot of time and work in this
          project. Without them this site would not exist.
        </Content>
      </Container>
    </>
  );
}

export default Home;
