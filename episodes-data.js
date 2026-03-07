// All Couch Lobsters episodes — sourced from RSS feed
// Episodes listed newest first (add new episodes to the TOP of this array)
// Episodes numbered 1–25, matching the RSS feed

const EPISODES = [
  {
    num: 25,
    title: "The Full Monty (1997) VS Charlie's Angels (2000)",
    date: "2025-12-13",
    duration: "1h 24m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/35/f5/35f53ebcb19b0a84a87ed208a8b2074f241204a8.jpg",
    spotifyUrl: "https://open.spotify.com/episode/2WVgmXOhDCg9DV2uNUDAWc",
    appleUrl: "https://podcasts.apple.com/au/podcast/the-full-monty-1997-vs-charlies-angels-2000/id1681472927?i=1000741132684",
    films: ["The Full Monty (1997)", "Charlie's Angels (2000)"]
  },
  {
    num: 24,
    title: "Oldboy (2003) VS The Last of the Mohicans (1992)",
    date: "2025-10-18",
    duration: "1h 41m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/2e/31/2e31887d2a1799df051fa497d2667c2baa41f6ed.jpg",
    spotifyUrl: "https://open.spotify.com/episode/3GWNGUSB1j9lRe0nfxWF8V",
    appleUrl: "https://podcasts.apple.com/au/podcast/oldboy-2003-vs-the-last-of-the-mohicans-1992/id1681472927?i=1000732430139",
    films: ["Oldboy (2003)", "The Last of the Mohicans (1992)"]
  },
  {
    num: 23,
    title: "True Romance (1993) VS The Da Vinci Code (2006)",
    date: "2025-08-17",
    duration: "1h 39m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/2b/f6/2bf68e237c44e00d7c328e4b293d08ae2a874ae2.jpg",
    spotifyUrl: "https://open.spotify.com/episode/2QdBpdsP0oGr0QvLRdC6pI",
    appleUrl: "https://podcasts.apple.com/au/podcast/true-romance-1993-vs-the-da-vinci-code-2006/id1681472927?i=1000722287516",
    films: ["True Romance (1993)", "The Da Vinci Code (2006)"]
  },
  {
    num: 22,
    title: "War Dogs (2016) VS Kiss Kiss Bang Bang (2005)",
    date: "2025-06-28",
    duration: "1h 22m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/62/75/62754fca0d06e6c6cdafccfb268f154a25dfe62d.jpg",
    spotifyUrl: "https://open.spotify.com/episode/0va7MOrxG21OKQktzcPthT",
    appleUrl: "https://podcasts.apple.com/au/podcast/war-dogs-2016-vs-kiss-kiss-bang-bang-2005/id1681472927?i=1000714920645",
    films: ["War Dogs (2016)", "Kiss Kiss Bang Bang (2005)"]
  },
  {
    num: 21,
    title: "Perfect Days (2023) VS 8 Mile (2002)",
    date: "2025-05-31",
    duration: "1h 55m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/c7/00/c7003f4ece1276b75d75a99dca83d2d37136e755.jpg",
    spotifyUrl: "https://open.spotify.com/episode/0JTpOmiSk5GmKmOwk5JH60",
    appleUrl: "https://podcasts.apple.com/au/podcast/perfect-days-2023-vs-8-mile-2002/id1681472927?i=1000710674087",
    films: ["Perfect Days (2023)", "8 Mile (2002)"]
  },
  {
    num: 20,
    title: "Hell or High Water (2016) VS Pearl Harbor (2001)",
    date: "2025-03-29",
    duration: "2h 00m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/72/8f/728ff127f043988209f45d7e471c004c7d9e323c.jpg",
    spotifyUrl: "https://open.spotify.com/episode/14FP5HW5sYLZZscPVPsrTa",
    appleUrl: "https://podcasts.apple.com/au/podcast/hell-or-high-water-2016-vs-pearl-harbor-2001/id1681472927?i=1000701360846",
    films: ["Hell or High Water (2016)", "Pearl Harbor (2001)"]
  },
  {
    num: 19,
    title: "Death Note (2006) VS Hot Fuzz (2007)",
    date: "2025-02-08",
    duration: "2h 20m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/66/be/66bec17182176c83baf700c5ed4ac0a1d8969307.jpg",
    spotifyUrl: "https://open.spotify.com/episode/4v4dTGESqfsEnr2PFz91YW",
    appleUrl: "https://podcasts.apple.com/au/podcast/death-note-2006-vs-hot-fuzz-2007/id1681472927?i=1000690289838",
    films: ["Death Note (2006)", "Hot Fuzz (2007)"]
  },
  {
    num: 18,
    title: "28 Days Later (2002) VS Human Traffic (1999)",
    date: "2024-11-17",
    duration: "2h 10m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/1b/c3/1bc3f32500f885fdc5103a510707d09db0d9beed.jpg",
    spotifyUrl: "https://open.spotify.com/episode/2la1UnN1Ev19MlJGNEsqsN",
    appleUrl: "https://podcasts.apple.com/au/podcast/28-days-later-2002-vs-human-traffic-1999/id1681472927?i=1000677224595",
    films: ["28 Days Later (2002)", "Human Traffic (1999)"]
  },
  {
    num: 17,
    title: "Hook (1991) VS Watchmen (2009)",
    date: "2024-09-29",
    duration: "1h 40m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/f9/7c/f97ca125119a08749775cad62a1e23de6b00c48a.jpg",
    spotifyUrl: "https://open.spotify.com/episode/50B02FxSqvYnR64048bXNZ",
    appleUrl: "https://podcasts.apple.com/au/podcast/hook-1991-vs-watchmen-2009/id1681472927?i=1000670839494",
    films: ["Hook (1991)", "Watchmen (2009)"]
  },
  {
    num: 16,
    title: "Hunt for the Wilderpeople (2016) VS Four Rooms (1995)",
    date: "2024-09-06",
    duration: "1h 40m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/93/d5/93d5f96975c823acb08f8a59be3963d698c4e372.jpg",
    spotifyUrl: "https://open.spotify.com/episode/5ZVmPJeJ7AT4ysH4TjtuAN",
    appleUrl: "https://podcasts.apple.com/au/podcast/hunt-for-the-wilderpeople-2016-vs-four-rooms-1995/id1681472927?i=1000668113793",
    films: ["Hunt for the Wilderpeople (2016)", "Four Rooms (1995)"]
  },
  {
    num: 15,
    title: "Rush Hour (1998) VS The Last Samurai (2003)",
    date: "2024-07-20",
    duration: "1h 34m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/ee/e3/eee37af0290be419b715dbbccc848730eee03d86.jpg",
    spotifyUrl: "https://open.spotify.com/episode/0Dee7x6pYBFhFwwtsC4DXY",
    appleUrl: "https://podcasts.apple.com/au/podcast/rush-hour-1998-vs-the-last-samurai-2003/id1681472927?i=1000662024985",
    films: ["Rush Hour (1998)", "The Last Samurai (2003)"]
  },
  {
    num: 14,
    title: "Pain & Gain (2013) VS HER (2013)",
    date: "2024-06-22",
    duration: "1h 52m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/21/e8/21e89229a683449735eff3a36ca0770896e47465.jpg",
    spotifyUrl: "https://open.spotify.com/episode/0pkN5Zq50plkBrmmcbGI3s",
    appleUrl: "https://podcasts.apple.com/au/podcast/pain-gain-2013-vs-her-2013/id1681472927?i=1000659440116",
    films: ["Pain & Gain (2013)", "HER (2013)"]
  },
  {
    num: 13,
    title: "Princess Mononoke (1997) VS Identity (2003)",
    date: "2024-05-25",
    duration: "1h 39m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/fd/6c/fd6cd3b5f5f8f9a30cb9c3d3369d553a5226dbf7.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Princess Mononoke (1997)", "Identity (2003)"]
  },
  {
    num: 12,
    title: "The Fast and the Furious (2001) VS Willy Wonka and the Chocolate Factory (1971)",
    date: "2024-04-07",
    duration: "1h 51m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/50/cf/50cf14514fb135017d8af60e45c33075ba6921de.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["The Fast and the Furious (2001)", "Willy Wonka and the Chocolate Factory (1971)"]
  },
  {
    num: 11,
    title: "Layer Cake (2004) VS Fargo S05 (2023)",
    date: "2024-03-10",
    duration: "2h 00m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/a3/24/a3248a1ec4f5f3523de34f9399f8acb4b2fc2728.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Layer Cake (2004)", "Fargo S05 (2023)"]
  },
  {
    num: 10,
    title: "Bruce Almighty (2003) VS What We Do in the Shadows (2014)",
    date: "2024-01-22",
    duration: "1h 48m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/44/74/4474f6eccbfe12899483ea54cef5f36d63538cdd.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Bruce Almighty (2003)", "What We Do in the Shadows (2014)"]
  },
  {
    num: 9,
    title: "Goldeneye (1995) VS Dark Waters (2019)",
    date: "2023-12-31",
    duration: "1h 53m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/d5/ab/d5ab9f5176b84bdfc351366997b6af108ba08f18.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Goldeneye (1995)", "Dark Waters (2019)"]
  },
  {
    num: 8,
    title: "Arrival (2016) VS Babylon (2022)",
    date: "2023-11-19",
    duration: "2h 10m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/73/0d/730d64ed7aa6b640ad255c3c55f6f9eb14a7abdd.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Arrival (2016)", "Babylon (2022)"]
  },
  {
    num: 7,
    title: "Ballers (2015) VS You Don't Mess With The Zohan (2008)",
    date: "2023-10-08",
    duration: "1h 34m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/a6/cc/a6cc440c4168845ec901e8ae5a7830007c075bfa.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Ballers (2015)", "You Don't Mess With The Zohan (2008)"]
  },
  {
    num: 6,
    title: "Solar Opposites (2020) VS The Matrix (1999)",
    date: "2023-09-17",
    duration: "1h 44m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/c9/94/c994febdf27337807edb18aa07dfea3c618af460.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Solar Opposites (2020)", "The Matrix (1999)"]
  },
  {
    num: 5,
    title: "Silo (2023) VS Midsommar (2019)",
    date: "2023-08-27",
    duration: "2h 02m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/52/ad/52ad5254a0351cf2d4d18e2178d449a6a969e168.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Silo (2023)", "Midsommar (2019)"]
  },
  {
    num: 4,
    title: "Bloodsport (1988) VS Barbarian (2022)",
    date: "2023-07-09",
    duration: "1h 55m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/78/0d/780d8f7a6424f3a7932c6521ffbedef6e20564ae.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Bloodsport (1988)", "Barbarian (2022)"]
  },
  {
    num: 3,
    title: "Tucker and Dale vs Evil (2010) VS BEEF (2023)",
    date: "2023-06-11",
    duration: "1h 50m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/9f/ea/9fea160964a59c2b2f191a244c343fdb7cb708eb.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["Tucker and Dale vs Evil (2010)", "BEEF (2023)"]
  },
  {
    num: 2,
    title: "The Meg (2018) VS The Faculty (1998)",
    date: "2023-04-23",
    duration: "2h 07m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/eb/f7/ebf7a5b1513ae5b7101b2da0e638fc7b92e831c4.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["The Meg (2018)", "The Faculty (1998)"]
  },
  {
    num: 1,
    title: "The Glory (2023) VS I Saw the Devil (2010)",
    date: "2023-04-09",
    duration: "1h 41m",
    artwork: "https://uploads.podcloud.fr/uploads/covers/32/45/32456380848aed5dffdf6dc9d5b64fe62f798b4b.jpg",
    spotifyUrl: "https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y",
    appleUrl: "https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927",
    films: ["The Glory (2023)", "I Saw the Devil (2010)"]
  }
];

// Format date nicely
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}
