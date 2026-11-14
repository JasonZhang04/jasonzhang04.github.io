// The "Other things" section. Lists are the user's picks (November 10 and 14, 2026); the short
// notes under each list are suggested jokes and are easy to delete.
export const quote = {
  text: 'Double the bug and give it to the next person.',
  note: 'A quote I find really funny. Source unknown, wisdom undeniable.',
};

export const favorites = [
  { title: 'Recommended movies', object: 'clapper', label: 'Pixel illustration of a film clapperboard.', items: ['3 Idiots', 'Moonlight', 'You Can See Everything (can we?)'], note: 'All is well.' },
  { title: 'Favorite games', object: 'gamepad', label: 'Pixel illustration of a game controller.', items: ['Hades', 'Dead Cells', 'Slay the Spire', 'Cyberpunk 2077'], note: 'Three roguelikes and Night City. I have made peace with dying.' },
  { title: 'Favorite anime', object: 'crt-tv', label: 'Pixel illustration of an old television showing a crescent moon.', items: ['Samurai Champloo', 'Cowboy Bebop', 'Detective Conan'], note: 'See you, space cowboy.' },
  {
    title: 'Favorite foods', object: 'noodle-bowl', label: 'Pixel illustration of a steaming bowl of noodles with chopsticks.',
    items: [
      { name: '胡辣汤', detail: 'Hot and spicy soup from Henan, my hometown' },
      { name: '烩面', detail: 'Lamb stewed noodles, also from Henan' },
      { name: 'Japanese ramen', detail: 'Best so far: Ramen Koganeya in Kyoto' },
    ],
    note: 'Always taking recommendations for new ramen places.',
  },
  {
    title: 'Recommended songs', object: 'headphones', label: 'Pixel illustration of headphones with music notes.',
    items: [
      { name: '四季ノ唄', detail: 'MINMI' },
      { name: '郭源潮', detail: '宋冬野' },
      { name: 'I’ll Be the One', detail: 'FLY COAST & Ai Ninomiya' },
    ],
    note: '四季ノ唄 is also the Samurai Champloo ending. Not a coincidence.',
  },
] as const;
