# Nightly build action for our apps


## Usage

```workflow

jobs:
  assignee_to_reviewer:
    runs-on: whatever-you-need
    steps:
      - name: Submit to Testflight - [Production, Stage]
        uses: voiapp/nightly-build-action-ios@VERSION-TAG
        with:
          environment: 'production-stage'
          developer_dir: ${{ matrix.xcode }}
          fastlane_password: ${{ secrets.FASTLANE_PASSWORD }}
          match_password: ${{ secrets.MATCH_PASSWORD }}
          slack_url: ${{ secrets.SLACK_WEBHOOK }} 

```

The environment variable takes either single environments (production, stage) or combined ones with a dash in between.
