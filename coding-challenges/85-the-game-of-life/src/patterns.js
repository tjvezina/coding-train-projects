patterns = [
  {
    name: 'Point',
    pattern: [
      '#',
    ]
  },
  {
    name: 'Plus',
    pattern: [
      ' # ',
      '###',
      ' # ',
    ]
  },
  {
    name: 'Block',
    pattern: [
      '##',
      '##',
    ]
  },
  {
    name: 'Beehive',
    pattern: [
      ' ## ',
      '#  #',
      ' ## ',
    ]
  },
  {
    name: 'Loaf',
    pattern: [
      ' ## ',
      '#  #',
      ' # #',
      '  # ',
    ]
  },
  {
    name: 'Boat',
    pattern: [
      '## ',
      '# #',
      ' # ',
    ]
  },
  {
    name: 'Tub',
    pattern: [
      ' # ',
      '# #',
      ' # ',
    ]
  },
  {
    name: 'Blinker',
    pattern: [
      '###',
    ]
  },
  {
    name: 'Toad',
    pattern: [
      ' ###',
      '### ',
    ]
  },
  {
    name: 'Beacon',
    pattern: [
      '##  ',
      '##  ',
      '  ##',
      '  ##',
    ]
  },
  {
    name: 'Pulsar',
    pattern: [
      '                 ',
      '     #     #     ',
      '     #     #     ',
      '     ##   ##     ',
      '                 ',
      ' ###  ## ##  ### ',
      '   # # # # # #   ',
      '     ##   ##     ',
      '                 ',
      '     ##   ##     ',
      '   # # # # # #   ',
      ' ###  ## ##  ### ',
      '                 ',
      '     ##   ##     ',
      '     #     #     ',
      '     #     #     ',
      '                 ',
    ]
  },
  {
    name: 'Pentadecathlon',
    pattern: [
      '###',
      '# #',
      '###',
      '###',
      '###',
      '###',
      '# #',
      '###',
    ]
  },
  {
    name: 'Glider',
    pattern: [
      ' # ',
      '  #',
      '###',
    ]
  },
  {
    name: 'Small ship',
    pattern: [
      '#  # ',
      '    #',
      '#   #',
      ' ####',
    ]
  },
  {
    name: 'Medium ship',
    pattern: [
      '  #   ',
      '#   # ',
      '     #',
      '#    #',
      ' #####',
    ]
  },
  {
    name: 'Heavy ship',
    pattern: [
      '  ##   ',
      '#    # ',
      '      #',
      '#     #',
      ' ######',
    ]
  },
  {
    name: 'Gosper glider gun',
    pattern: [
      '                        #           ',
      '                      # #           ',
      '            ##      ##            ##',
      '           #   #    ##            ##',
      '##        #     #   ##              ',
      '##        #   # ##    # #           ',
      '          #     #       #           ',
      '           #   #                    ',
      '            ##                      ',
    ]
  },
]

patternNames = patterns.map(p => p.name)