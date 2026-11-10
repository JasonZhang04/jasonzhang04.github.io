// The "Other things" section. Lists are the user's picks (November 10, 2026); the short
// notes under each list are suggested jokes and are easy to delete.
export const quote = {
  text: 'Double the bug and give it to the next person.',
  note: 'A quote I find really funny. Source unknown, wisdom undeniable.',
};

export const favorites = [
  { title: 'Recommended movies', object: 'clapper', label: 'Pixel illustration of a film clapperboard.', items: ['3 Idiots', 'Moonlight', 'You Can See Everything (can we?)'], note: 'All is well.' },
  { title: 'Favorite games', object: 'gamepad', label: 'Pixel illustration of a game controller.', items: ['Hades', 'Dead Cells', 'Slay the Spire', 'Cyberpunk 2077'], note: 'Three roguelikes and Night City. I have made peace with dying.' },
  { title: 'Favorite anime', object: 'crt-tv', label: 'Pixel illustration of an old television showing a crescent moon.', items: ['Samurai Champloo', 'Cowboy Bebop', 'Detective Conan'], note: 'See you, space cowboy.' },
] as const;
