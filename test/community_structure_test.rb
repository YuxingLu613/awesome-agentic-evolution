require "minitest/autorun"
require "yaml"

ROOT = File.expand_path("..", __dir__)

class CommunityStructureTest < Minitest::Test
  REQUIRED_FILES = [
    "CALL_FOR_CONTRIBUTORS.md",
    "COMMUNITY.md",
    "ROADMAP.md",
    "docs/plans/2026-07-28-community-survey-tutorial-design.md"
  ].freeze

  EVIDENCE_FIELDS = [
    "resource_type",
    "canonical_url",
    "evolution_target",
    "feedback_signal",
    "persistent_artifact",
    "evaluation",
    "reproducibility",
    "safety",
    "conflict_of_interest"
  ].freeze

  AUTHORSHIP_POLICY_FILES = [
    "README.md",
    "CALL_FOR_CONTRIBUTORS.md",
    "COMMUNITY.md",
    "ROADMAP.md",
    "docs/plans/2026-07-28-community-survey-tutorial-design.md"
  ].freeze

  def test_community_documents_exist
    missing = REQUIRED_FILES.reject { |path| File.file?(File.join(ROOT, path)) }

    assert_empty missing, "Missing community documents: #{missing.join(", ")}"
  end

  def test_readme_links_to_community_entry_points
    readme = File.read(File.join(ROOT, "README.md"))
    missing = REQUIRED_FILES.first(3).reject { |path| readme.include?("(#{path})") }

    assert_empty missing, "README does not link to: #{missing.join(", ")}"
  end

  def test_resource_issue_form_collects_survey_ready_evidence
    form = YAML.safe_load(
      File.read(File.join(ROOT, ".github/ISSUE_TEMPLATE/resource.yml"))
    )
    field_ids = form.fetch("body").map { |field| field["id"] }.compact
    missing = EVIDENCE_FIELDS - field_ids

    assert_empty missing, "Resource form is missing fields: #{missing.join(", ")}"
  end

  def test_github_actions_runs_the_community_structure_test
    workflow = File.read(File.join(ROOT, ".github/workflows/links.yml"))

    assert_includes workflow, "ruby test/community_structure_test.rb"
  end

  def test_substantive_contributions_can_qualify_for_authorship
    missing = AUTHORSHIP_POLICY_FILES.reject do |path|
      File.read(File.join(ROOT, path)).split.join(" ").include?(
        "can qualify contributors for survey-paper authorship"
      )
    end

    assert_empty missing, "Inclusive authorship policy is missing from: #{missing.join(", ")}"
  end
end
