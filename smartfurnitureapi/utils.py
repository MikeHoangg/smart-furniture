def get_default_height(options):
    if options.type in ['sofa', 'bed', 'chair']:
        return options.creator.height * 3 / 7
    elif options.type in ['table', 'desk']:
        return options.creator.height * 4 / 7
    else:
        return options.creator.height * 10 / 7


def get_default_length(options):
    if options.type in ['sofa', 'chair']:
        return options.creator.height * 2 / 7
    elif options.type in ['table', 'desk']:
        return options.creator.height * 4 / 7
    elif options.type in ['bed']:
        return options.creator.height * 10 / 7
    else:
        return options.creator.height * 3 / 7


def get_default_width(options):
    if options.type in ['sofa', 'bed']:
        return options.creator.height * 9 / 7
    elif options.type in ['table', 'desk']:
        return options.creator.height * 5 / 7
    elif options.type in ['chair']:
        return options.creator.height * 2 / 7
    else:
        return options.creator.height * 4 / 7
