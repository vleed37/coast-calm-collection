
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS rooms_breakdown text[] NOT NULL DEFAULT '{}';

UPDATE public.properties
SET rooms_breakdown = ARRAY[
      'Main bedroom: 1 King bed and en-suite bathroom',
      'Second bedroom: 2 Single beds',
      '1 full bathroom'
    ],
    features = ARRAY[
      'Air conditioning in bedrooms and living room',
      'Linen and towels provided',
      'Ocean and bay views',
      'Indoor braai area',
      'Private patio with outdoor seating',
      'Fully equipped kitchen with dishwasher',
      'Complimentary unlimited high-speed Wi-Fi',
      '65-inch Smart TV',
      'Washing machine',
      'Secure self-check-in',
      'Solar-powered home',
      'Close to beaches, restaurants and local attractions'
    ]
WHERE slug = 'sage-and-salt';

UPDATE public.properties
SET rooms_breakdown = ARRAY[
      'Main bedroom: 1 King bed and en-suite bathroom',
      'Second bedroom: 2 Single beds',
      '1 full bathroom'
    ],
    features = ARRAY[
      'Air conditioning in bedrooms and living room',
      'Linen and bath towels included',
      'Ocean views',
      'Indoor braai area for all-weather use',
      'Private patio with outdoor seating',
      'Fully equipped kitchen with dishwasher',
      'Complimentary Wi-Fi',
      '65-inch Smart TV',
      'Solar-powered home',
      'Washing machine',
      'Beach umbrella provided',
      'Foldable clothes drying rack',
      'Secure self-check-in',
      'Close to beaches, shops and local attractions'
    ]
WHERE slug = 'sky-and-sea';

UPDATE public.properties
SET rooms_breakdown = ARRAY[
      '2 bedrooms, both with king-size beds',
      '2 bathrooms plus a downstairs guest toilet'
    ],
    features = ARRAY[
      'Stylish double-storey home, sleeps up to 4 guests',
      'Quality linen and bath towels provided on arrival',
      'Air conditioning in bedrooms and living room',
      'Indoor braai',
      'Fully equipped kitchen with dishwasher',
      'Washing machine',
      'Complimentary Wi-Fi',
      'Secure self-check-in',
      '6-seater golf cart',
      'Secure estate location within a cul-de-sac'
    ]
WHERE slug = '10-seaview-close';
