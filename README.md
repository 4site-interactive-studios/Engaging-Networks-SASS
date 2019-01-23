# Engaging Network Templates by 4Site


## How to install the repository and work locally

1. Clone the repository to your computer.
2. Open the terminal and type `npm install` to install the third-party dependencies.
   - If you don't have npm: https://blog.teamtreehouse.com/install-node-js-npm-mac
   - Install XCode: https://itunes.apple.com/us/app/xcode/id497799835?mt=12
   - Install Homebrew via Terminal : ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   - Install NPM via Terminal: brew install node
3. Run `gulp` to start the compiling + watch tasks.
4. Change anything you want. The assets will get recompiled every time you save.
5. When you finish, type `CTRL+C` on the terminal to exit the watch task.
6. Run `gulp prod` to generate the minified assets.
7. Commit & Push your changes.

## How to customize template/colors

1. Adjust the colors on `src/scss/themes/_variables.scss`
2. Open `src/scss/theme.scss` and define which theme you want to use.
3. Compile the assets by running `gulp` / `gulp prod`.
4. Go to your browser and access one of the provided HTML templates (`template-1.html`, `template-2.html`, etc).

## How to create a new theme/template

1. Clone one of the provided templates (`template-1.html`, `template-2.html`, etc) into a new file.
2. Put your customized CSS Styles into a new SASS file on `src/scss/pages/_MYTEMPLATE.scss`.
3. Create your CSS Theme on `src/scss/themes/_theme-MYTHEME.scss`.
4. Import your Theme File on `src/scss/theme.scss`.
5. Import your Template SASS File on `src/scss/styles.scss`.


## Sass File Structure

```
src/scss
│   styles.scss
│   theme.scss    
│
└─── abstracts
│       _functions.scss
│       _mixins.scss
│       _variables-default.scss
│   
└─── base
│       _base.scss
│       _fonts.scss
│       _helpers.scss
│       _typography.scss
│   
└─── components
│       _button.scss
│       _copy-block.scss
│       _designed-by-4site.scss
│       _ellipsis.scss
│       _error.scss
│       _form.scss
│       _payment.scss
│       _radio-to-button.scss
│       _spinner.scss
│
└─── layout
│       _embed.scss
│       _footer.scss
│       _header.scss
│       _not-page-builder.scss
│       _page-builder.scss
│
└─── pages
│       _template-1.scss
│       _template-2.scss
│
└─── themes
│       _theme-ict.scss
│       _theme-oca.scss
│       _variables.scss
│
└─── vendors
│       _include-media.scss
│       _normalize.scss
│       _rem.scss
│       _sanitize.scss
│
```
