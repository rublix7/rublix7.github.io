
import { BibleBook } from './types';

export const BIBLE_BOOKS: BibleBook[] = [
  // Ветхий Завет
  // Пятикнижие Моисея
  { name: 'Бытие', chapters: 50, testament: 'old', category: 'pentateuch' },
  { name: 'Исход', chapters: 40, testament: 'old', category: 'pentateuch' },
  { name: 'Левит', chapters: 27, testament: 'old', category: 'pentateuch' },
  { name: 'Числа', chapters: 36, testament: 'old', category: 'pentateuch' },
  { name: 'Второзаконие', chapters: 34, testament: 'old', category: 'pentateuch' },
  
  // Книги исторические
  { name: 'Иисуса Навина', chapters: 24, testament: 'old', category: 'history' },
  { name: 'Судей Израилевых', chapters: 21, testament: 'old', category: 'history' },
  { name: 'Руфь', chapters: 4, testament: 'old', category: 'history' },
  { name: '1-я Царств', chapters: 31, testament: 'old', category: 'history' },
  { name: '2-я Царств', chapters: 24, testament: 'old', category: 'history' },
  { name: '3-я Царств', chapters: 22, testament: 'old', category: 'history' },
  { name: '4-я Царств', chapters: 25, testament: 'old', category: 'history' },
  { name: '1-я Паралипоменон', chapters: 29, testament: 'old', category: 'history' },
  { name: '2-я Паралипоменон', chapters: 36, testament: 'old', category: 'history' },
  { name: '1-я Ездры', chapters: 10, testament: 'old', category: 'history' },
  { name: 'Неемии', chapters: 13, testament: 'old', category: 'history' },
  { name: '2-я Ездры', chapters: 9, testament: 'old', category: 'history' }, // Неканоническая
  { name: 'Товит', chapters: 14, testament: 'old', category: 'history' }, // Неканоническая
  { name: 'Иудифь', chapters: 16, testament: 'old', category: 'history' }, // Неканоническая
  { name: 'Есфирь', chapters: 10, testament: 'old', category: 'history' },
  { name: '1-я Маккавейская', chapters: 16, testament: 'old', category: 'history' }, // Неканоническая
  { name: '2-я Маккавейская', chapters: 15, testament: 'old', category: 'history' }, // Неканоническая
  { name: '3-я Маккавейская', chapters: 7, testament: 'old', category: 'history' }, // Неканоническая

  // Книги учительные
  { name: 'Иова', chapters: 42, testament: 'old', category: 'wisdom' },
  { name: 'Псалтирь', chapters: 150, testament: 'old', category: 'wisdom' },
  { name: 'Притчи Соломоновы', chapters: 31, testament: 'old', category: 'wisdom' },
  { name: 'Екклесиаст', chapters: 12, testament: 'old', category: 'wisdom' },
  { name: 'Песнь Песней Соломона', chapters: 8, testament: 'old', category: 'wisdom' },
  { name: 'Премудрости Соломона', chapters: 19, testament: 'old', category: 'wisdom' }, // Неканоническая
  { name: 'Премудрости Иисуса, сына Сирахова', chapters: 51, testament: 'old', category: 'wisdom' }, // Неканоническая

  // Книги пророческие
  { name: 'Исаии', chapters: 66, testament: 'old', category: 'prophets' },
  { name: 'Иеремии', chapters: 52, testament: 'old', category: 'prophets' },
  { name: 'Плач Иеремии', chapters: 5, testament: 'old', category: 'prophets' },
  { name: 'Послание Иеремии', chapters: 1, testament: 'old', category: 'prophets' }, // Неканоническая
  { name: 'Варуха', chapters: 5, testament: 'old', category: 'prophets' }, // Неканоническая
  { name: 'Иезекииля', chapters: 48, testament: 'old', category: 'prophets' },
  { name: 'Даниила', chapters: 12, testament: 'old', category: 'prophets' }, // + главы 13, 14 неканонические
  { name: 'Осии', chapters: 14, testament: 'old', category: 'prophets' },
  { name: 'Иоиля', chapters: 3, testament: 'old', category: 'prophets' },
  { name: 'Амоса', chapters: 9, testament: 'old', category: 'prophets' },
  { name: 'Авдия', chapters: 1, testament: 'old', category: 'prophets' },
  { name: 'Ионы', chapters: 4, testament: 'old', category: 'prophets' },
  { name: 'Михея', chapters: 7, testament: 'old', category: 'prophets' },
  { name: 'Наума', chapters: 3, testament: 'old', category: 'prophets' },
  { name: 'Аввакума', chapters: 3, testament: 'old', category: 'prophets' },
  { name: 'Софонии', chapters: 3, testament: 'old', category: 'prophets' },
  { name: 'Аггея', chapters: 2, testament: 'old', category: 'prophets' },
  { name: 'Захарии', chapters: 14, testament: 'old', category: 'prophets' },
  { name: 'Малахии', chapters: 4, testament: 'old', category: 'prophets' },
  { name: '3-я Ездры', chapters: 16, testament: 'old', category: 'prophets' }, // Неканоническая

  // Новый Завет
  // Евангелия
  { name: 'От Матфея', chapters: 28, testament: 'new', category: 'gospels' },
  { name: 'От Марка', chapters: 16, testament: 'new', category: 'gospels' },
  { name: 'От Луки', chapters: 24, testament: 'new', category: 'gospels' },
  { name: 'От Иоанна', chapters: 21, testament: 'new', category: 'gospels' },

  // Деяния
  { name: 'Деяния святых Апостолов', chapters: 28, testament: 'new', category: 'acts' },

  // Соборные Послания
  { name: 'Иакова', chapters: 5, testament: 'new', category: 'catholic' },
  { name: '1-е Петра', chapters: 5, testament: 'new', category: 'catholic' },
  { name: '2-е Петра', chapters: 3, testament: 'new', category: 'catholic' },
  { name: '1-е Иоанна', chapters: 5, testament: 'new', category: 'catholic' },
  { name: '2-е Иоанна', chapters: 1, testament: 'new', category: 'catholic' },
  { name: '3-е Иоанна', chapters: 1, testament: 'new', category: 'catholic' },
  { name: 'Иуды', chapters: 1, testament: 'new', category: 'catholic' },

  // Послания св. Апостола Павла
  { name: 'К Римлянам', chapters: 16, testament: 'new', category: 'pauline' },
  { name: '1-е Коринфянам', chapters: 16, testament: 'new', category: 'pauline' },
  { name: '2-е Коринфянам', chapters: 13, testament: 'new', category: 'pauline' },
  { name: 'К Галатам', chapters: 6, testament: 'new', category: 'pauline' },
  { name: 'К Ефесянам', chapters: 6, testament: 'new', category: 'pauline' },
  { name: 'К Филиппийцам', chapters: 4, testament: 'new', category: 'pauline' },
  { name: 'К Колоссянам', chapters: 4, testament: 'new', category: 'pauline' },
  { name: '1-е Фессалоникийцам', chapters: 5, testament: 'new', category: 'pauline' },
  { name: '2-е Фессалоникийцам', chapters: 3, testament: 'new', category: 'pauline' },
  { name: '1-е Тимофею', chapters: 6, testament: 'new', category: 'pauline' },
  { name: '2-е Тимофею', chapters: 4, testament: 'new', category: 'pauline' },
  { name: 'К Титу', chapters: 3, testament: 'new', category: 'pauline' },
  { name: 'К Филимону', chapters: 1, testament: 'new', category: 'pauline' },
  { name: 'К Евреям', chapters: 13, testament: 'new', category: 'pauline' },

  // Книга пророческая
  { name: 'Откровение Иоанна Богослова', chapters: 22, testament: 'new', category: 'revelation' },
];
